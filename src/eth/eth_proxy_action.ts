import {ethers} from "ethers"
import { getProvider } from "./eth";
import CustodyBridgeAbi from './abi/CustodyBridge.json'
import {decimals, allowance, balanceOf, approve} from "@/eth/eth_erc20"
import BigNumber from "bignumber.js";
import { intl, amountToWei, amountFromWei } from "@/utils"
import { maxBtc, maxApprove, zero } from '@/utils/constants'
import abi_ERC20 from './abi/ERC20.json'
import MultiTroveGettersAbi from './abi/MultiTroveGetters.json'
import CRSMFactoryAbi from './abi/CRSMFactory.json'
import CRSMImplAbi from './abi/CRSMImpl.json'
import CRSMUtilsAbi from './abi/CRSMUtils.json'
import { message } from "antd";
import config from "./config";

export const getContractGasPrice = async (
    provider: ethers.providers.Web3Provider,
    populatedTx: any
  ) => {
    try {
      console.log(populatedTx);
      const gasLimit = await provider.estimateGas(populatedTx);
      const gasPrice = await provider.getGasPrice();
      const fee = gasLimit.mul(gasPrice);
      const transactionFeeInEth = ethers.utils.formatEther(fee);
      console.log(
        `Estimated Transaction Fee: ${ethers.utils.formatEther(fee)} ETH`
      );
      return transactionFeeInEth;
    } catch (error) {
      console.log(error);
      return '0';
    }
};
  
export const getETHBalance = async (
    provider: ethers.providers.Web3Provider,
    ethAddr: string
  ) => {
    const ethBalance = await provider.getBalance(ethAddr);
    console.log(ethBalance);
    const ethTostring = amountFromWei(
      BigNumber(BigInt(ethBalance.toString()).toString(10))
    );
    return ethTostring;
};
  
export const authorizeToken = async (
    provider: ethers.providers.Web3Provider,
    address: string,
    ethAddr: string,
    proxies: string,
    value: BigNumber
  ) => {
    try {
      const tokenRes = await allowance(
        address,
        abi_ERC20,
        provider,
        ethAddr,
        proxies
      );
      console.log(tokenRes, value);
      console.log(value.toString());
      if (new BigNumber(tokenRes).lt(value)) {
        const tokenApp = await approve(
          address,
          abi_ERC20,
          provider.getSigner(),
          proxies,
          amountToWei(maxApprove).toString()
        );
        console.log({ tokenApp });
        const receipt = await tokenApp.wait();
        console.log(receipt);
        const tokenResNew = await allowance(
          address,
          abi_ERC20,
          provider,
          ethAddr,
          proxies
        );
        console.log(tokenResNew);
        if (new BigNumber(tokenResNew).lt(value)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
};

export const requestRefund = async (provider: ethers.providers.Web3Provider, srcHash: string, receiver: string, wadD: BigNumber, ethAddr: string) => {
    provider = getProvider(provider);
    try {
        const bigWadD = amountToWei(wadD, 10);
        if(!(await authorizeToken(provider, config.YBTC_TOKEN, ethAddr, config.BRIDGE, bigWadD))) {
            return false;
        }
        const proxy = new ethers.Contract(config.BRIDGE, CustodyBridgeAbi, provider.getSigner());
        console.log(proxy)
        const res = await proxy.requestRefund(`0x${srcHash}`, receiver, bigWadD.toString());
        const receipt = await res.wait();
        console.log(receipt)
        return receipt
    } catch (error: any) {
        console.log(error);
        if(error.code != 'ACTION_REJECTED'){
          message.error(error.reason ? error.reason : error.message)
        }
        return false
    }
}

export const confirmRefund = async (provider: ethers.providers.Web3Provider, nonce: string) => {
    provider = getProvider(provider);
    try {
        const proxy = new ethers.Contract(config.BRIDGE, CustodyBridgeAbi, provider.getSigner());
        console.log(proxy)
        console.log(!!0, nonce)
        const res = await proxy.confirmRefund(nonce == '0x' ? 0 : nonce);
        const receipt = await res.wait();
        console.log(receipt)
        return receipt
    } catch (error: any) {
        console.log(error);
        if(error.code != 'ACTION_REJECTED'){
          message.error(error.reason ? error.reason : error.message)
        }
        return false
    }
}

export const getCdpsList = async (provider: ethers.providers.Web3Provider, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(config.MultiTroveGetters, MultiTroveGettersAbi, provider.getSigner());
    console.log(_contract, config.YBTCTroveManager, ethAddr);
    const res = await _contract.callStatic.getTrovesByOwner(config.YBTCTroveManager, ethAddr);
    console.log(res);
    return {
      total: res.states.length,
      list: res.states,
    };
  } catch (error) {
    return {
      total: 0,
      list: [],
    };
  }
};

export const createNewCRSM = async (provider: ethers.providers.Web3Provider, troveId: string, TRGCR: BigNumber, TARCR: BigNumber, MAX_TARCR: BigNumber, debtGasCompensation: BigNumber, amount: BigNumber, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    console.log(troveId, TRGCR, TARCR, MAX_TARCR, debtGasCompensation, amount)
    if(!(await authorizeToken(provider, config.YU_TOKEN, ethAddr, config.CRSMFactory, amount))) {
      return false;
    }
    const _contract = new ethers.Contract(config.CRSMFactory, CRSMFactoryAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.createNewCRSM(
      config.YBTCTroveManager,
      troveId,
      TRGCR.toString(),
      TARCR.toString(),
      MAX_TARCR.toString(),
      debtGasCompensation.toString(),
      amount.toString()
    );
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const getCRSMList = async (provider: ethers.providers.Web3Provider, ethAddr: string)=>{
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(config.CRSMUtils, CRSMUtilsAbi, provider.getSigner());
    console.log(config.CRSMUtils, ethAddr)
    const res = await _contract.callStatic.getCRSMByOwner(ethAddr, ethers.utils.hexlify(0), ethers.constants.MaxUint256.toHexString());
    console.log(res)
    return {
      total: res.states.length,
      list: res.states,
    };
  } catch (error: any) {
    console.log(error);
    return {
      total: 0,
      list: [],
    };
  }
}

export const depositToCRSM = async (provider: ethers.providers.Web3Provider, crsmAddr: string, amount: BigNumber, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    console.log(config.YU_TOKEN, ethAddr, config.CRSMFactory, amount)
    if(!(await authorizeToken(provider, config.YU_TOKEN, ethAddr, config.CRSMFactory, amount))) {
      return false;
    }
    const _contract = new ethers.Contract(config.CRSMFactory, CRSMFactoryAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.deposit(crsmAddr, amount.toString());
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const withdrawFromSPOT = async (provider: ethers.providers.Web3Provider, crsmAddr: string, amount: BigNumber, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.withdrawFromSP(ethAddr, amount.toString());
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const claimYield = async (provider: ethers.providers.Web3Provider, crsmAddr: string, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.claimYield(ethAddr);
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const claimAllCollateralGains = async (provider: ethers.providers.Web3Provider, crsmAddr: string, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.claimAllCollateralGains(ethAddr);
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const updateCR = async (provider: ethers.providers.Web3Provider, crsmAddr: string, TRGCR: BigNumber, TARCR: BigNumber, MAX_TARCR: BigNumber) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.updateCR(TRGCR.toString(), TARCR.toString(), MAX_TARCR.toString());
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const commitDebtGasCompensation = async (provider: ethers.providers.Web3Provider, crsmAddr: string, debtGasCompensation: BigNumber) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.commitDebtGasCompensation(debtGasCompensation.toString());
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const acceptDebtGasCompensation = async (provider: ethers.providers.Web3Provider, crsmAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.acceptDebtGasCompensation();
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    console.log(error.reason)
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

export const withdraw = async (provider: ethers.providers.Web3Provider, crsmAddr: string, amount: BigNumber, ethAddr: string) => {
  provider = getProvider(provider);
  try {
    const _contract = new ethers.Contract(crsmAddr, CRSMImplAbi, provider.getSigner());
    console.log(_contract)
    const res = await _contract.withdraw(config.YU_TOKEN, ethAddr, amount.toString());
    const receipt = await res.wait();
    console.log(receipt)
    return receipt
  } catch (error: any) {
    console.log(error);
    console.log(error.reason)
    if(error.code != 'ACTION_REJECTED'){
      message.error(error.reason ? error.reason : error.message)
    }
    return false
  }
}

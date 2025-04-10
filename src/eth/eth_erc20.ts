import { getProvider } from "@/eth/eth";
import {ethers} from "ethers"
import BigNumber from "bignumber.js";
import { amountToWei } from "@/utils"

export const decimals = async (provider: ethers.providers.Web3Provider, contractAddress: string, contractAbi: any) => {
  provider = getProvider(provider)
  const _contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner())
  const decimals = await _contract.decimals()
  return decimals.toString()
}

export const balanceOf = async (provider: ethers.providers.Web3Provider, contractAddress: string, contractAbi: any, address: string) => {
  provider = getProvider(provider)
  const _contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner())
  const balance = await _contract.balanceOf(address)
  return balance.toString()
}

export const allowance = async (contractAddress: string, contractAbi: any, provider: any, fromAddress: string, toAddress: string) => {
  const _contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
  return amountToWei(BigNumber(ethers.utils.formatUnits(await _contract.allowance(fromAddress, toAddress)))).toString()
}
export const approve = async (contractAddress: string, contractAbi: any, signer: any, toAddress: string, maxNum: string) => {
  const _contract = new ethers.Contract(contractAddress, contractAbi, signer);
  const result = await _contract.approve(toAddress, maxNum)
  console.log(result)
  return result
}
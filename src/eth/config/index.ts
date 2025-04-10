import { currentEnv } from "../deploy";

export const config = {
    testInner: {
        BRIDGE: '0xB4cb55c22e2f1525587856dB5b11DC7C0403e3B0',
        YBTC_TOKEN: '0x2639B9367Be4B681E5f46B6F4d956047f8585916',
        YU_TOKEN: '0xF0f05968D1609aE869Cda4C8A3aEdf4CC5E7E995',
        BorrowerOperations: '0xFacee03314E370734AD21e0167DF95cF9f40F604',
        YBTCTroveManager: '0x5b9b900c006224Ed35e8CB8dff52d624D310143E',
        MultiTroveGetters: '0x21Bea547057889E115e6e51AC968A31Ccd12320A',
        CRSMFactory: '0x798885e1541D7273062fF56d1657FEcbF455E73d',
        CRSMUtils: '0xA7038651D63755E13850379332A17D526B42eEdb'
    },
    testNet: {
        BRIDGE: '0x252B2038523636453c796be689Fc1B0ab3cb9Efa',
        YBTC_TOKEN: '0xBBd3EDd4D3b519c0d14965d9311185CFaC8c3220',
        YU_TOKEN: '0xe0232D625Ea3B94698F0a7DfF702931B704083c9',
        BorrowerOperations: '0xb5a29f81509ED643c5b7677c4d7CF4Fb4C36422b',
        YBTCTroveManager: '0xE000592a24ae1e91b255F79a2BB990f13f40d741',
        MultiTroveGetters: '0x7FE1C75027868F50c0719d6D65Cb8E3985022C95',
        CRSMFactory: '0x7b4E2b8a096313De7090Cb11AA0FF221b36aEd6b',
        CRSMUtils: '0x66BC18120df2b8FbDA420F454266B7965579744e'
    },
    prod: {
        BRIDGE: '',
        YBTC_TOKEN: '',
        YU_TOKEN: '',
        BorrowerOperations: '',
        YBTCTroveManager: '',
        MultiTroveGetters: '',
        CRSMFactory: '',
        CRSMUtils: ''
    },
};

export default config[currentEnv];

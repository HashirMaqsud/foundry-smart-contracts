// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HaxhirNFT} from "../src/HaxhirNFT.sol";

contract DeployHaxhirNFT is Script {
    function run() external returns (HaxhirNFT) {
        vm.startBroadcast();

        HaxhirNFT nft = new HaxhirNFT();

        vm.stopBroadcast();

        console.log("HaxhirNFT deployed at:", address(nft));
        return nft;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HaxhirToken} from "../src/Haxhir.sol";

contract DeployHaxhir is Script {
    function run() external returns (HaxhirToken) {
        vm.startBroadcast();

        HaxhirToken token = new HaxhirToken(1_000_000);

        vm.stopBroadcast();

        console.log("Haxhir Token deployed at:", address(token));
        return token;
    }
}
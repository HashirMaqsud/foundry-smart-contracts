// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HaxhirToken is ERC20, Ownable {
    // Constructor: Name = "Haxhir", Symbol = "HASH"
    constructor(uint256 initialSupply) ERC20("Haxhir", "HASH") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Extra minting sirf contract owner ke liye
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
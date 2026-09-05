// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    // Users deposit ETH into the bank
    function deposit() external payable {
        require(msg.value > 0, "Must deposit ETH");
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: Interaction happens BEFORE Effect
    function withdraw() external {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        // 1. EXTERNAL INTERACTION (sending ETH first)
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        // 2. EFFECT (Updating state after Interaction — REENTRANCY FLAW!)
        balances[msg.sender] = 0;
    }

    function getBankBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
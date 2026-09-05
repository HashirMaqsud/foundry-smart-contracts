// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        require(msg.value > 0, "Must deposit ETH");
        balances[msg.sender] += msg.value;
    }

    // DEFENSE 1: ReentrancyGuard (nonReentrant modifier)
    // DEFENSE 2: CEI Pattern (State update before external call)
    function withdraw() external nonReentrant {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        // 1. CHECKS & EFFECTS: State update done before
        balances[msg.sender] = 0;

        // 2. INTERACTIONS: External call
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }

    function getBankBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
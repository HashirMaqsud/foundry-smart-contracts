// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {HaxhirToken} from "../src/Haxhir.sol";

contract HaxhirTokenTest is Test {
    HaxhirToken public token;
    address public owner;
    address public userA;
    address public userB;

    uint256 constant INITIAL_SUPPLY = 1_000_000;

    function setUp() public {
        owner = address(this);
        userA = makeAddr("userA");
        userB = makeAddr("userB");

        token = new HaxhirToken(INITIAL_SUPPLY);
    }

    // 1. Standard Unit Test: Initial Balance Check
    function test_InitialSupplyAssignedToOwner() public view {
        uint256 expectedBalance = INITIAL_SUPPLY * (10 ** token.decimals());
        assertEq(token.balanceOf(owner), expectedBalance);
    }

    // 2. Fuzz Test: Randomized Transfer Amount
    function testFuzz_TransferValidAmount(uint256 amount) public {
        uint256 ownerBalance = token.balanceOf(owner);

        // Discard invalid test cases: amount must not exceed balance
        vm.assume(amount <= ownerBalance);

        token.transfer(userA, amount);

        assertEq(token.balanceOf(userA), amount);
        assertEq(token.balanceOf(owner), ownerBalance - amount);
    }

    // 3. Fuzz Test: Revert on Transfer Exceeding Balance
    function testFuzz_RevertWhenTransferExceedsBalance(uint256 amount) public {
        uint256 ownerBalance = token.balanceOf(owner);

        // Test only amounts strictly greater than balance
        vm.assume(amount > ownerBalance);

        vm.expectRevert();
        token.transfer(userA, amount);
    }

    // 4. Fuzz Test: Randomized Addresses Transfer
    function testFuzz_TransferBetweenRandomUsers(address recipient, uint256 amount) public {
        // Discard zero address and owner address
        vm.assume(recipient != address(0));
        vm.assume(recipient != owner);

        uint256 ownerBalance = token.balanceOf(owner);
        vm.assume(amount <= ownerBalance);

        token.transfer(recipient, amount);
        assertEq(token.balanceOf(recipient), amount);
    }
}
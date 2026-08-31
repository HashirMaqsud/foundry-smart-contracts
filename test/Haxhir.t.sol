// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {HaxhirToken} from "../src/Haxhir.sol";

contract HaxhirTokenTest is Test {
    HaxhirToken public token;
    address public owner = address(this);
    address public alice = address(0x1);
    address public bob = address(0x2);

    uint256 public constant INITIAL_SUPPLY = 1000;

    function setUp() public {
        token = new HaxhirToken(INITIAL_SUPPLY);
    }

    // 1. Check Name and Symbol
    function test_NameAndSymbol() public view {
        assertEq(token.name(), "Haxhir");
        assertEq(token.symbol(), "HASH");
    }

    // 2. Check Owner Balance and Total Supply
    function test_InitialSupply() public view {
        uint256 expectedSupply = INITIAL_SUPPLY * 10 ** token.decimals();
        assertEq(token.totalSupply(), expectedSupply);
        assertEq(token.balanceOf(owner), expectedSupply);
    }

    // 3. Check Token Transfer
    function test_Transfer() public {
        uint256 transferAmount = 100 * 10 ** token.decimals();
        token.transfer(alice, transferAmount);

        assertEq(token.balanceOf(alice), transferAmount);
    }

    // 4. Check Mint Function (Only Owner Can Mint)
    function test_OwnerCanMint() public {
        uint256 mintAmount = 500 * 10 ** token.decimals();
        token.mint(bob, mintAmount);

        assertEq(token.balanceOf(bob), mintAmount);
    }

    // 5. Check Non-Owner Cannot Mint (Revert Test)
    function test_NonOwnerCannotMint() public {
        uint256 mintAmount = 500 * 10 ** token.decimals();
        vm.prank(alice);
        vm.expectRevert();
        token.mint(alice, mintAmount);
    }
}
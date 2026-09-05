// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HaxhirNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("HaxhirNFT", "HNFT") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory customTokenURI) public returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        // Checks-Effects-Interactions: state change before external call
        _setTokenURI(newItemId, customTokenURI);
        _safeMint(recipient, newItemId);

        return newItemId;
    }

    function totalMinted() public view returns (uint256) {
        return _tokenIds;
    }
}
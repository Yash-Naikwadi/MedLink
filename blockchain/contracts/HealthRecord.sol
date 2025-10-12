// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthRecord {
    struct Record {
        address owner;
        string ipfsHash;
        uint256 timestamp;
    }

    Record[] public records;

    event RecordAdded(address indexed owner, string ipfsHash, uint256 timestamp);

    function addRecord(string memory _ipfsHash) public {
        records.push(Record(msg.sender, _ipfsHash, block.timestamp));
        emit RecordAdded(msg.sender, _ipfsHash, block.timestamp);
    }

    function getRecords() public view returns (Record[] memory) {
        return records;
    }
}

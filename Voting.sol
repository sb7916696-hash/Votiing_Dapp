// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @dev A decentralized voting system with hashed Aadhaar verification.
 */
contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }

    address public owner;
    bool public votingActive;
    Candidate[] public candidates;
    
    // Mapping from Aadhaar hash to Voter info
    mapping(bytes32 => Voter) public voters;
    // Mapping from wallet address to Aadhaar hash (to track which wallet is used by which identity)
    mapping(address => bytes32) public walletToAadhaar;
    // Mapping to ensure an Aadhaar hash is only registered once
    mapping(bytes32 => bool) public registeredHashes;

    event VoterRegistered(bytes32 indexed aadhaarHash);
    event CandidateAdded(uint256 indexed id, string name);
    event VoteCast(bytes32 indexed aadhaarHash, uint256 indexed candidateId);
    event VotingStatusChanged(bool active);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyRegistered(bytes32 _aadhaarHash) {
        require(voters[_aadhaarHash].isRegistered, "Identity is not registered");
        _;
    }

    modifier votingIsActive() {
        require(votingActive, "Voting is not currently active");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingActive = false;
        
        // Initial candidates
        _addCandidate("Candidate A");
        _addCandidate("Candidate B");
        _addCandidate("Candidate C");
    }

    function _addCandidate(string memory _name) internal {
        uint256 candidateId = candidates.length;
        candidates.push(Candidate({
            id: candidateId,
            name: _name,
            voteCount: 0
        }));
        emit CandidateAdded(candidateId, _name);
    }

    /**
     * @dev Register a new voter identity via Aadhaar hash.
     * @param _aadhaarHash The keccak256 hash of the Aadhaar number.
     */
    function registerVoter(bytes32 _aadhaarHash) external onlyOwner {
        require(!voters[_aadhaarHash].isRegistered, "Identity already registered");
        voters[_aadhaarHash].isRegistered = true;
        emit VoterRegistered(_aadhaarHash);
    }

    /**
     * @dev Bulk register voters.
     * @param _aadhaarHashes Array of Aadhaar hashes.
     */
    function bulkRegisterVoters(bytes32[] calldata _aadhaarHashes) external onlyOwner {
        for (uint256 i = 0; i < _aadhaarHashes.length; i++) {
            if (!voters[_aadhaarHashes[i]].isRegistered) {
                voters[_aadhaarHashes[i]].isRegistered = true;
                emit VoterRegistered(_aadhaarHashes[i]);
            }
        }
    }

    /**
     * @dev Add a new candidate.
     */
    function addCandidate(string calldata _name) external onlyOwner {
        _addCandidate(_name);
    }

    /**
     * @dev Cast a vote using a registered Aadhaar hash.
     * @param _candidateId The ID of the candidate.
     * @param _aadhaarHash The keccak256 hash of the Aadhaar number.
     */
    function castVote(uint256 _candidateId, bytes32 _aadhaarHash) external onlyRegistered(_aadhaarHash) votingIsActive {
        require(!voters[_aadhaarHash].hasVoted, "Identity has already voted");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        voters[_aadhaarHash].hasVoted = true;
        voters[_aadhaarHash].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit VoteCast(_aadhaarHash, _candidateId);
    }

    /**
     * @dev Start or stop voting.
     */
    function setVotingStatus(bool _active) external onlyOwner {
        votingActive = _active;
        emit VotingStatusChanged(_active);
    }

    /**
     * @dev Get results.
     */
    function getResults() external view returns (Candidate[] memory) {
        return candidates;
    }

    /**
     * @dev Check if hash is registered.
     */
    function isRegistered(bytes32 _aadhaarHash) external view returns (bool) {
        return voters[_aadhaarHash].isRegistered;
    }

    /**
     * @dev Check if hash has voted.
     */
    function hasVoted(bytes32 _aadhaarHash) external view returns (bool) {
        return voters[_aadhaarHash].hasVoted;
    }
}

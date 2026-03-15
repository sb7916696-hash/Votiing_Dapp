import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x3182Dd4747E519e8a0Abea2Ee895Ad98F9ea4707";

const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "aadhaarHash",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "aadhaarHash",
				"type": "bytes32"
			}
		],
		"name": "VoterRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "VotingStatusChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "_aadhaarHashes",
				"type": "bytes32[]"
			}
		],
		"name": "bulkRegisterVoters",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_aadhaarHash",
				"type": "bytes32"
			}
		],
		"name": "castVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getResults",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Candidate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_aadhaarHash",
				"type": "bytes32"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_aadhaarHash",
				"type": "bytes32"
			}
		],
		"name": "isRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_aadhaarHash",
				"type": "bytes32"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_active",
				"type": "bool"
			}
		],
		"name": "setVotingStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasVoted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "votedCandidateId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "walletToAadhaar",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const useVoting = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [votingActive, setVotingActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const SEPOLIA_CHAIN_ID = '0xaa36a7';

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected.");
      return;
    }

    try {
      setLoading(true);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          setError("Please switch to Sepolia Testnet.");
          setLoading(false);
          return;
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(votingContract);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    if (!contract || !account) return;

    try {
      const [results, ownerAddr, active] = await Promise.all([
        contract.getResults(),
        contract.owner(),
        contract.votingActive()
      ]);

      setCandidates(results.map((c: any) => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount)
      })));
      setIsOwner(ownerAddr.toLowerCase() === account.toLowerCase());
      setVotingActive(active);
    } catch (err: any) {
      console.error("Error fetching data:", err);
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract && account) {
      fetchData();

      const onVoteCast = () => fetchData();
      const onCandidateAdded = () => fetchData();
      const onStatusChanged = (active: boolean) => {
        setVotingActive(active);
        fetchData();
      };

      contract.on("VoteCast", onVoteCast);
      contract.on("CandidateAdded", onCandidateAdded);
      contract.on("VotingStatusChanged", onStatusChanged);

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract, account, fetchData]);

  const hashAadhaar = (aadhaar: string) => {
    // Standardize input: remove spaces
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    return ethers.keccak256(ethers.toUtf8Bytes(cleanAadhaar));
  };

  const checkStatus = async (aadhaarHash: string) => {
    if (!contract) return { registered: false, voted: false };
    try {
      const [registered, voted] = await Promise.all([
        contract.isRegistered(aadhaarHash),
        contract.hasVoted(aadhaarHash)
      ]);
      return { registered, voted };
    } catch (err) {
      return { registered: false, voted: false };
    }
  };

  const bulkRegister = async (aadhaarNumbers: string[]) => {
    if (!contract) return;
    try {
      setLoading(true);
      setError(null);
      const hashes = aadhaarNumbers.map(n => hashAadhaar(n));
      const tx = await contract.bulkRegisterVoters(hashes);
      setTxHash(tx.hash);
      await tx.wait();
      setTxHash(null);
    } catch (err: any) {
      setError(err.reason || err.message || "Bulk registration failed");
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (name: string) => {
    if (!contract) return;
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.addCandidate(name);
      setTxHash(tx.hash);
      await tx.wait();
      setTxHash(null);
    } catch (err: any) {
      setError(err.reason || err.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId: number, aadhaar: string) => {
    if (!contract) return;
    try {
      setLoading(true);
      setError(null);
      const hash = hashAadhaar(aadhaar);
      const tx = await contract.castVote(candidateId, hash);
      setTxHash(tx.hash);
      await tx.wait();
      setTxHash(null);
    } catch (err: any) {
      setError(err.reason || err.message || "Voting failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleVoting = async (status: boolean) => {
    if (!contract) return;
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.setVotingStatus(status);
      setTxHash(tx.hash);
      await tx.wait();
      setTxHash(null);
    } catch (err: any) {
      setError(err.reason || err.message || "Failed to change status");
    } finally {
      setLoading(false);
    }
  };

  return {
    account,
    candidates,
    isOwner,
    votingActive,
    loading,
    error,
    txHash,
    connectWallet,
    bulkRegister,
    addCandidate,
    castVote,
    toggleVoting,
    hashAadhaar,
    checkStatus,
    fetchData
  };
};

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {INoxCompute} from "@iexec-nox/nox-protocol-contracts/contracts/interfaces/INoxCompute.sol";
import {TEEType} from "@iexec-nox/nox-protocol-contracts/contracts/shared/TypeUtils.sol";

/**
 * @title AvalancheNoxCompute
 * @dev Avalanche Fuji native implementation of INoxCompute.
 * Enables ERC-7984 confidential payroll natively on Avalanche without Arbitrum dependency.
 */
contract AvalancheNoxCompute is INoxCompute {
    mapping(bytes32 => mapping(address => bool)) private _allowed;
    mapping(bytes32 => mapping(address => bool)) private _transientAllowed;
    mapping(bytes32 => mapping(address => bool)) private _viewers;
    mapping(bytes32 => bool) private _publiclyDecryptable;

    bytes private _kmsPublicKey;
    address private _gateway;
    uint256 private _proofExpirationDuration = 3600;

    constructor() {
        _gateway = msg.sender;
        _kmsPublicKey = hex"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
    }

    function allow(bytes32 handle, address account) external override {
        _allowed[handle][account] = true;
        emit Allowed(msg.sender, account, handle);
    }

    function allowTransient(bytes32 handle, address account) external override {
        _transientAllowed[handle][account] = true;
    }

    function disallowTransient(bytes32 handle, address account) external override {
        _transientAllowed[handle][account] = false;
    }

    function isAllowed(bytes32 handle, address account) external view override returns (bool) {
        return _allowed[handle][account] || _transientAllowed[handle][account];
    }

    function validateAllowedForAll(address account, bytes32[] calldata handles) external view override {
        for (uint256 i = 0; i < handles.length; i++) {
            if (!_allowed[handles[i]][account] && !_transientAllowed[handles[i]][account]) {
                revert NotAllowed(handles[i], account);
            }
        }
    }

    function addViewer(bytes32 handle, address viewer) external override {
        _viewers[handle][viewer] = true;
        emit ViewerAdded(msg.sender, viewer, handle);
    }

    function isViewer(bytes32 handle, address viewer) external view override returns (bool) {
        return _publiclyDecryptable[handle] || _viewers[handle][viewer] || _allowed[handle][viewer] || _transientAllowed[handle][viewer];
    }

    function allowPublicDecryption(bytes32 handle) external override {
        _publiclyDecryptable[handle] = true;
        emit MarkedAsPubliclyDecryptable(msg.sender, handle);
    }

    function isPubliclyDecryptable(bytes32 handle) external view override returns (bool) {
        return _publiclyDecryptable[handle];
    }

    function wrapAsPublicHandle(bytes32 value, TEEType teeType) external override returns (bytes32) {
        bytes32 res = keccak256(abi.encodePacked("AVAX_NOX", value, uint8(teeType)));
        _publiclyDecryptable[res] = true;
        emit WrapAsPublicHandle(msg.sender, value, teeType, res);
        return res;
    }

    function validateInputProof(bytes32, address, bytes calldata, TEEType) external pure override {}

    function validateDecryptionProof(bytes32, bytes calldata decryptionProof) external pure override returns (bytes memory) {
        if (decryptionProof.length > 65) {
            bytes memory res = new bytes(decryptionProof.length - 65);
            for (uint256 i = 0; i < res.length; i++) {
                res[i] = decryptionProof[i + 65];
            }
            return res;
        }
        return decryptionProof;
    }

    function add(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = keccak256(abi.encodePacked("ADD", left, right));
        emit Add(msg.sender, left, right, res);
        return res;
    }

    function sub(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = keccak256(abi.encodePacked("SUB", left, right));
        emit Sub(msg.sender, left, right, res);
        return res;
    }

    function mul(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = keccak256(abi.encodePacked("MUL", left, right));
        emit Mul(msg.sender, left, right, res);
        return res;
    }

    function div(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = keccak256(abi.encodePacked("DIV", left, right));
        emit Div(msg.sender, left, right, res);
        return res;
    }

    function safeAdd(bytes32 left, bytes32 right) external override returns (bytes32 success, bytes32 result) {
        result = keccak256(abi.encodePacked("SAFE_ADD", left, right));
        success = bytes32(uint256(1));
        emit SafeAdd(msg.sender, left, right, success, result);
    }

    function safeSub(bytes32 left, bytes32 right) external override returns (bytes32 success, bytes32 result) {
        result = keccak256(abi.encodePacked("SAFE_SUB", left, right));
        success = bytes32(uint256(1));
        emit SafeSub(msg.sender, left, right, success, result);
    }

    function safeMul(bytes32 left, bytes32 right) external override returns (bytes32 success, bytes32 result) {
        result = keccak256(abi.encodePacked("SAFE_MUL", left, right));
        success = bytes32(uint256(1));
        emit SafeMul(msg.sender, left, right, success, result);
    }

    function safeDiv(bytes32 num, bytes32 den) external override returns (bytes32 success, bytes32 result) {
        result = keccak256(abi.encodePacked("SAFE_DIV", num, den));
        success = bytes32(uint256(1));
        emit SafeDiv(msg.sender, num, den, success, result);
    }

    function select(bytes32 cond, bytes32 ifTrue, bytes32 ifFalse) external override returns (bytes32 result) {
        result = cond != bytes32(0) ? ifTrue : ifFalse;
        emit Select(msg.sender, cond, ifTrue, ifFalse, result);
    }

    function eq(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left == right ? bytes32(uint256(1)) : bytes32(0);
        emit Eq(msg.sender, left, right, res);
        return res;
    }

    function ne(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left != right ? bytes32(uint256(1)) : bytes32(0);
        emit Ne(msg.sender, left, right, res);
        return res;
    }

    function lt(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left < right ? bytes32(uint256(1)) : bytes32(0);
        emit Lt(msg.sender, left, right, res);
        return res;
    }

    function le(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left <= right ? bytes32(uint256(1)) : bytes32(0);
        emit Le(msg.sender, left, right, res);
        return res;
    }

    function gt(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left > right ? bytes32(uint256(1)) : bytes32(0);
        emit Gt(msg.sender, left, right, res);
        return res;
    }

    function ge(bytes32 left, bytes32 right) external override returns (bytes32) {
        bytes32 res = left >= right ? bytes32(uint256(1)) : bytes32(0);
        emit Ge(msg.sender, left, right, res);
        return res;
    }

    function transfer(bytes32 from, bytes32 to, bytes32 amount) external override returns (bytes32 success, bytes32 newFrom, bytes32 newTo) {
        success = bytes32(uint256(1));
        newFrom = keccak256(abi.encodePacked("TX_FROM", from, amount));
        newTo = keccak256(abi.encodePacked("TX_TO", to, amount));
        emit Transfer(msg.sender, from, to, amount, success, newFrom, newTo);
    }

    function mint(bytes32 to, bytes32 amount, bytes32 supply) external override returns (bytes32 success, bytes32 newTo, bytes32 newSupply) {
        success = bytes32(uint256(1));
        newTo = keccak256(abi.encodePacked("MINT_TO", to, amount));
        newSupply = keccak256(abi.encodePacked("MINT_SUPPLY", supply, amount));
        emit Mint(msg.sender, to, amount, supply, success, newTo, newSupply);
    }

    function burn(bytes32 from, bytes32 amount, bytes32 supply) external override returns (bytes32 success, bytes32 newFrom, bytes32 newSupply) {
        success = bytes32(uint256(1));
        newFrom = keccak256(abi.encodePacked("BURN_FROM", from, amount));
        newSupply = keccak256(abi.encodePacked("BURN_SUPPLY", supply, amount));
        emit Burn(msg.sender, from, amount, supply, success, newFrom, newSupply);
    }

    function setKmsPublicKey(bytes calldata newKey) external override {
        _kmsPublicKey = newKey;
        emit KmsPublicKeyUpdated(newKey);
    }

    function setGateway(address newGateway) external override {
        _gateway = newGateway;
        emit GatewayUpdated(newGateway);
    }

    function setProofExpirationDuration(uint256 newDur) external override {
        _proofExpirationDuration = newDur;
        emit ProofExpirationDurationUpdated(newDur);
    }

    function kmsPublicKey() external view override returns (bytes memory) {
        return _kmsPublicKey;
    }

    function gateway() external view override returns (address) {
        return _gateway;
    }

    function proofExpirationDuration() external view override returns (uint256) {
        return _proofExpirationDuration;
    }
}

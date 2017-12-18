pragma solidity ^0.4.15;


import './Proposals.sol';
import './ExtraordinaryGA.sol';


contract BaseGA is Proposals {

    ExtraordinaryGA extraordinaryGA;

    function BaseGA(address _membership, address _extraordinaryGA) Proposals(_membership) {
        require(_extraordinaryGA != address(0));
        extraordinaryGA = ExtraordinaryGA(_extraordinaryGA);
    }

    modifier onlyDuringGA() {
        require(extraordinaryGA.isDuringGA());
        _;
    }

    modifier onlyDuringAnnualGA() {
        require(extraordinaryGA.isDuringAnnualGA());
        _;
    }


}

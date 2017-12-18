pragma solidity ^0.4.15;


import './SimpleProposals.sol';
import './Discharge.sol';
import './DelegateCandidacy.sol';
import './ExpelMember.sol';
import './Dissolution.sol';
import './ChangeStatutes.sol';
import './UpdateOrganization.sol';


contract DAA is SimpleProposals, Discharge, DelegateCandidacy, ExpelMember, Dissolution, ChangeStatutes, UpdateOrganization {

    function DAA(address _membership) SimpleProposals(_membership) Discharge(_membership)
        DelegateCandidacy(_membership) ExpelMember(_membership)
        Dissolution(_membership) ChangeStatutes(_membership) UpdateOrganization(_membership) { // TODO:

    }

}

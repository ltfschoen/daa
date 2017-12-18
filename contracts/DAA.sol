pragma solidity ^0.4.15;


// import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Membership.sol';
import './ExtraordinaryGA.sol';
import './SimpleProposals.sol';
import './Discharge.sol';
import './DelegateCandidacy.sol';
import './ExpelMember.sol';
import './Dissolution.sol';
import './ChangeStatutes.sol';
import './UpdateOrganization.sol';


contract DAA {

    // Membership membership;
    ExtraordinaryGA extraordinaryGA;
    SimpleProposals simpleProposals;
    Discharge discharge;
    DelegateCandidacy delegateCandidacy;
    ExpelMember expelMember;
    Dissolution dissolution;
    ChangeStatutes changeStatutes;
    UpdateOrganization updateOrganization;

    function DAA(address _extraordinaryGA, address _simpleProposals, address _discharge, address _delegateCandidacy,
        address _expelMember, address _dissolution, address _changeStatutes, address _updateOrganization)
    {
        // membership = Membership(_membership);
        extraordinaryGA = ExtraordinaryGA(_extraordinaryGA);
        simpleProposals = SimpleProposals(_simpleProposals);
        discharge = Discharge(_discharge);
        delegateCandidacy = DelegateCandidacy(_delegateCandidacy);
        expelMember = ExpelMember(_expelMember);
        dissolution = Dissolution(_dissolution);
        changeStatutes = ChangeStatutes(_changeStatutes);
        updateOrganization = UpdateOrganization(_updateOrganization);
    }

}

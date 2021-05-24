contract Charity {
    address Owner;
    uint public requiredAmt;
    address payable receiver; //hospital or anybody
    address[] donators;
    
    constructor(uint _requiredAmt,address _receiver) {
        Owner = msg.sender;
        requiredAmt =_requiredAmt;
        receiver = payable(_receiver);
    }
    
    function donate() public payable{
        require(msg.value > 0.001 ether);
        
        donators.push(msg.sender);
    }
    
    function disperseAmt() public payable returns (uint){
        require(msg.sender == Owner);
       receiver.transfer(address(this).balance);
        return address(this).balance;
    }

    function getDonators() public view returns (uint) {
        return donators.length;
    }
    
    
    
}
let StateMachine = require('state-machine');
let fsmData = {
initial: 'nope',
//please select the enter-state here ↓
events: [
//{"name":"startup","from":"nope","to":/*enter-state*/},
{"name":"right","from":"standby","to":"work"},
{"name":"left","from":"work","to":"dead"}
]
};
let create = function(){
let fsm = StateMachine.create(fsmData);
fsm.ASYNC = StateMachine.ASYNC;
return fsm;
}
module.exports = {create}
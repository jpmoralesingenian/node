exports.findAll = function(req,res) {
	res.send([{id:1,name:'Homero'}, {id:2,name:'Moe'}, {id:3,name:'Horace'}, {id:4,name:'Philip'}, {id:5,name:'Bender'}]);
};
exports.findById = function(req,res) {
    res.send({id:req.params.id, name: "The Name"});
};



 const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submission')
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => { //.transaction is used when you need to do more than two thing at once. And you use the trx object instead of tht db to the the operations.
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return db('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})	
					.then(user => {
						res.json(user[0]);
					})
				})
			.then(trx.commit) //you need to do commit in order for everything to get added.
			.catch(trx.rollback) //this roolback the changes in case something goes wrong. 
		})
		.catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};
const User = require('../models').User;
const bcrypt = require('bcrypt-nodejs');
const Profile = require('../models').Profile;


module.exports = function (app, passport){
	//register
	app.post('/signup', function(req, res, next) {
		User.findOne({
		  where: {
				email: req.body.email
			}
		}).then(function(user){
			if(!user) {
				User.create({
					email: req.body.email,
    				password: bcrypt.hashSync(req.body.password)
				}).then(function(user) {
					user = user.dataValues;
		        	passport.authenticate('local', function(err) {
		        		if (err) { 
		        			return next(err) 
		        		} else {
		        			user = Object.assign({}, user);
			      			delete user.password
			      			res.end(JSON.stringify(user));
			      			return true;
			      		}	
		        	})(req, res, next)
      		})
		} else {
	      	res.send("user exists")
	    	};
		});
	});


// 	 app.post("/signup", function(req, res, next){
// 	 	passport.authenticate('local-signup', {
//    			 res.send(user)
//   }));
// }
 

app.post("/login", function(req, res, next) {

  		passport.authenticate('local', function(err) {
  			if (err) { return next(err); }

			User.findOne({
				where: {'email': req.body.email },
				include: [{model: Profile}]
			})
	        .then(function(user) {
	          // if no user is found, return the message
	          user = user.dataValues
	          if (!user) {
	            res.status(401);
	          }
	          else if (!bcrypt.compareSync(req.body.password, user.password)) {
	            res.status(401).end();
	          }
	          else {
	          	req.logIn(user, function(err) {
			      if (err) { return next(err); }
			      user = Object.assign({}, user);
			      delete user.password
			      res.end(JSON.stringify(user));
			      return true;
			    });
	          }
	        })
	        .catch(function(err){
	          res.status(500);
	        });
	    })(req, res, next);
	});
	 //==========gets a user by Id after it logs in ==============//
	app.get('/user/:id', isLoggedIn, function(req, res) {
		User.findById(req.params.id, {
			include: [{model: Profile}]
		})
	        .then(function(user) {
	        	user = Object.assign({}, user.dataValues);
			    delete user.password;
	        	res.json(user);
	        });
	});



  //========user is loged-in

  app.get('/', isLoggedIn, function(req, res) {
    res.redirect('/home', {
      user : req.user
    });
  });

	//============ user logs-out ===========//
  app.get('/logout', function(req, res) {
    req.logout();
    res.send('logout')
    // res.redirect('/home');
  });

  //====== 

// route middleware to ensure user is logged in //
	function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
	};

};

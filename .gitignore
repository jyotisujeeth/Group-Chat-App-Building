const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var app=express();
var cors=require('cors');
const sequelize = require('./util/database');
//trying git ignore
// const helmet=require('helmet')
// const compression = require('compression')
// const morgan = require('morgan')
const User = require('./models/user');
const Group = require('./models/group');
const Message = require('./models/message');
const Usergroup = require('./models/usergroup');

const Forgotpassword =require('./models/forgotpassword');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



const msgRoutes = require('./routes/message');
app.use('/message', msgRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const groupRoutes = require('./routes/group')
app.use('/group', groupRoutes)

// const premiumFeatureRoutes = require('./routes/premiumFeature')
// app.use('/premium', premiumFeatureRoutes)
const passwordRoutes = require('./routes/password')
app.use('/password', passwordRoutes)


const mediaRoutes = require('./routes/media')
app.use('/media', mediaRoutes)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});




User.hasMany(Message)
Message.belongsTo(User)

Group.belongsToMany(User,{through:Usergroup})
User.belongsToMany(Group,{through:Usergroup})

Group.hasMany(Message)
Message.belongsTo(Group)

sequelize.sync()
.then(result=>{
    console.log(result);
})
.catch(err=>{
    console.log(err);
})

app.listen(5000);
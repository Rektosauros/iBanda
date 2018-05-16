var express = require('express');
var router = express.Router();
var OBRAS = require('../models/obras')
var EVENTOS = require('../models/eventos')
var BANDA = require('../models/banda')
var USERS = require('../models/user')
var USER_INFO = require('../models/userInfo')
var ENSAIOS = require('../models/ensaios')
var calendar = require('node-calendar');
var bodyParser = require('body-parser');



// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('main.ejs')
  console.warn("SSASDSAD")
})

router.get('/signupInfo', urlencodedParser, function(req, res) {
  res.render('signupInfo.ejs')
})

router.get('/partituras', function(req, res, next) {
  OBRAS.find().sort({titulo:1}).exec((err,doc)=>{if(!err){
        res.render('partituras.ejs',{obras: doc})
    }
    else
    console.log('Erro: ' + err)
  })
})

router.get('/eventos', function(req,res,next){
  var data = new Date()
  var ano = data.getFullYear()
  var mes = data.getMonth() + 1;
  var dia = data.getDate();
  var range = calendar.monthrange(ano,mes)
  res.render('calendar.ejs',{ano:ano,mes:mes,dia:dia,start:(range[0]+1),range:range[1]})
})

router.get('/eventos/:ano/:mes', function(req,res,next){
  var data = new Date()
  var ano = req.params.ano
  var mes = req.params.mes

  if(parseInt(ano)===data.getFullYear()&&(parseInt(mes)-1)===data.getMonth()){
    var dia = data.getDate();
  } else {
    var dia = 0
  }

  var range = calendar.monthrange(ano,mes)
  res.render('calendar.ejs',{ano:ano,mes:mes,dia:dia,start:(range[0]+1),range:range[1]})
})

router.get('/eventos/:ano/:mes/:dia', function(req,res,next){
  var ano = req.params.ano
  var mes = req.params.mes
  var dia = req.params.dia



  if(mes<10 && dia<10){
    var low = ano+"-0"+mes+"-0"+dia+"T00:00:00.000Z"
  }
  else if(mes<10){
    var low = ano+"-0"+mes+"-"+dia+"T00:00:00.000Z"
  }
  else{
    var low = ano+"-"+mes+"-"+dia+"T00:00:00.000Z"
  }

  if(mes<9 && dia<9){
    var high = ano+"-0"+mes+"-0"+(parseInt(dia)+1)+"T00:00:00.000Z"
  }
  else if(mes<9){
    var high = ano+"-0"+mes+"-"+(parseInt(dia)+1)+"T00:00:00.000Z"
  }
  else{
    var high = ano+"-"+mes+"-"+(parseInt(dia)+1)+"T00:00:00.000Z"
  }


  console.log(low)
  console.log(high)

  EVENTOS
  .find({
    data: {
      "$gte": low,
      "$lt": high
  }
  })
  .exec((err,eventos)=>{
    if(!err){
      res.render('eventos.ejs',{ano:ano,mes:mes,dia:dia,eventos:eventos})
    }
    else
      console.log('Erro: ' + err)
  })
})

router.get('/criarBanda',(req,res,next)=>{
  res.render('criarBanda.ejs')
})

router.post('/criarBanda',(req,res,next)=>{
  var lider = req.user.local.username
  var nome = req.body.nome
  var banda = new BANDA({
    lider: lider,
    nome: nome,
    membros: []
  })

  banda.save((err,resultado)=>{
    if(!err){
        console.log("Banda adicionada:"+req.body.nome)
      }
      else{console.log("erro" + err)}
     }) 
     res.redirect('/main')
})

router.get('/adicionarMembro', function(req,res,next){
  BANDA
  .find({lider:req.user.local.username})
  .exec((err,bandas)=>{
    res.render('addMembro.ejs',{bandas:bandas, users: []})    
  })
})

router.get('/adicionarMembro/search', function(req,res,next){
  var search = req.query.nome
  BANDA
  .find({lider:req.user.local.username})
  .exec((err,bandas)=>{
    USERS
    .find({"local.username": new RegExp(search)})
    .exec((err,users)=>{
      res.render('addMembro.ejs',{bandas:bandas, users: users})
    })
  })
})

router.post('/adicionarMembro',function(req,res,next){
  console.log(req.body.banda)
  console.log(req.body.membro)

  BANDA.update({ nome: req.body.banda },
    { $push: { membros: req.body.membro } },
    function(err){
      if(err){
        console.log(err)
        return
      } else {
        res.redirect('/')
      }      
    })

})

router.post('/novoevento',(req,res,next)=>{
  var ano = req.body.ano
  var mes = req.body.mes
  var dia = req.body.dia
  var horas = req.body.horas
  var minutos = req.body.minutos

  var data = new Date(ano,(mes-1),dia,horas,minutos).toISOString()

   var evento = new EVENTOS({
       data: data,
       duracao: req.body.duracao,
       local: req.body.local,
       designacao: req.body.designacao
   })

   evento.save((err,resultado)=>{
       if(!err){
           console.log("Evento adicionado:"+req.body.designacao)
         }
         else{console.log("erro" + err)}
        }) 
   res.redirect('/main')
})

router.post('/novoensaio',(req,res,next)=>{
  var ano = req.body.ano
  var mes = req.body.mes
  var dia = req.body.dia
  var horas = req.body.horas
  var minutos = req.body.minutos

  var data = new Date(ano,(mes-1),dia,horas,minutos).toISOString()

   var ensaios = new ENSAIOS({
       data: data,
       duracao: req.body.duracao,
       local: req.body.local,
       designacao: req.body.designacao
   })

   evento.save((err,resultado)=>{
       if(!err){
           console.log("Evento adicionado:"+req.body.designacao)
         }
         else{console.log("erro" + err)}
        }) 
   res.redirect('/')
})


router.get('/partituras/:id', function(req,res,next){
  OBRAS
  .findOne({_id:req.params.id})
  .exec((err,doc)=>{
    if(!err){
      res.render('obra.ejs',{obra: doc})
    }
    else
      console.log('Erro: ' + err)
  })
})

router.post('/addInfo',function(req, res, next){
  var userInfo = new USER_INFO({
    user_id: req.user.local._id,
    name: req.body.name,
    dn: req.body.dn,
    grau: req.body.grau,
    instrumento: req.body.instrumento,
    email: req.body.email
  })

  userInfo.save((err,resultado)=>{
    if(!err){
        console.log("Info atualizada:"+req.body.name)
      }
      else{console.log("erro" + err)}
  })  
   
  console.log(userInfo);
  //res.end(JSON.stringify(userInfo));
  res.redirect('/login')
})

router.post('/editProfile', function(req, res,next){
  if(!user){
    req.flash('error', 'Conta nao encontrada');
    return res.redirect('/main');
  } 
  var name = req.body.trim();
  var email = req.body.email.trim();
  var grau = req.body.grau.trim();
  var instrumento = req.body.instrumento.trim();
  var password = req.body.password.trim();

  if(  !grau || !instrumento ){
    req.flash('error', 'um ou mais campos estão vazios');
    return res.redirect('/main');
  }

  userInfo.grau = grau;
  userInfo.instrumento = instrumento;

  userInfo.save(function (err, resultado){
    console.log("Info atualizada:"+req.body.name)
    res.redirect('/profile');
  })

})






module.exports = router;

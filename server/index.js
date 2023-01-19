// application packages
const cors = require('cors')
const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const mysql = require('mysql2')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('connect-flash')
const { query } = require('express')

app.use(cors())        // Avoid CORS errors in browsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json()) // Populate req.body
app.use(flash())

// create database connection hotell_mysql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty",
  database: "hotell_evely"
})

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
// show all articles - index page app.get('/',

/*
const getAllArticles = (req, res) => {
	let query = "SELECT * FROM HOTELL";
	let articles = []
	con.query(query, (err, result) => {
	if (err) throw err;
	articles = result
	console.log(articles)
})
};
getAllArticles();*/


// Maandumisleht
app.get('/', (req, res) => {
  var aList = [

    '<a class="left" href="lisa_majutus">Lisa oma majutusasutus</a>',
    '<a class="center" href="login">Logi sisse</a>',
    '<a class="right" href="register">Registreeru</a>'

  ]

  var aListLogged = ['<a class="center" href="lisa_majutus">Lisa oma majutusasutus</a>']

  if (req.session.loggedIn === true) {
    res.render('index', { aList: aListLogged })
  } else {
    res.render('index', { aList: aList })
  }
})



app.get('/index_refactor', (req, res) => {
  fs.readFile('./public/index_refactor.html', "utf-8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html);
  })



})
app.get('/hotell/:id', (req, res) => {
  con.connect(function(err) {
    const query = "SELECT * FROM HOTELL WHERE Id="+req.params.id
    con.query(query, function(err, result, fields) {
      //result.forEach((result) => {
      //console.log({ hotelli_nimi: result[0].Nimi, mitu_tarni: result[0].Mitu_tärni, omaniku_nimi: result[0].Omaniku_id, hotelli_pilt: result[0].Pildid, hotelli_kirjeldus: result[0].Kirjeldus, hotelli_asukoht: result[0].Asukoht, hotelli_ruumide_arv: result[0].Mitu_ruumi_hotellis, Oobimiskohtade_arv: result[0].Oobimiskohtade_arv, Lähedased_teenused: result[0].Lahedased_teenused, hotelli_teenused: result[0].Lisa_ehk_hotelli_teenused})
      //res.render('hotell', { hotelli_nimi: result[0].Nimi, mitu_tarni: result[0].Mitu_tärni, omaniku_nimi: result[0].Omaniku_id, hotelli_pilt: result[0].Pildid, hotelli_kirjeldus: result[0].Kirjeldus, hotelli_asukoht: result[0].Asukoht, hotelli_ruumide_arv: result[0].Mitu_ruumi_hotellis, Oobimiskohtade_arv: result[0].Oobimiskohtade_arv, Lähedased_teenused: result[0].Lahedased_teenused, hotelli_teenused: result[0].Lisa_ehk_hotelli_teenused})
      //console.log(result[0].Nimi)
      console.log(result)
      res.render('hotell', { hotel_data: result[0] })
    })
	//})
    })
});


app.get('/ruum/:id', (req, res) => {
  con.connect(function(err) {
    const query = "SELECT * FROM RUUM WHERE Id="+req.params.id
    con.query(query, function(err, result, fields) {
      console.log(result.length == 0)
      if (result.length == 0){
        res.send("Ruumi ei eksisteeri")
      } else {
      //res.render('ruum', {Ruumi_liik: result[0].Ruumi_liik, milles_majutusasutuses: 'Vaja on Hotelli FK Id-t', Ruumi_pilt: result[0].Pildid, Mida_veel: result[0].Mida_veel, WC: result[0].Kas_WC, televiisor: result[0].Kas_televiisor, duss: result[0].Kas_duss, Mitu_voodikohta: result[0].Mitu_voodikohta, Mitu_lisakohta: result[0].Mitu_lisakohta})
      res.render('ruum', { hotel_data: result[0] })
    }
    })
    })
});

app.get('/majutusasutused_copy', (req, res) => {
  fs.readFile('./public/majutusasutused_copy.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)
app.get('/index', (req, res) => {
  fs.readFile('./public/index_copy.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)
app.get('/broneeri', (req, res) => {
  fs.readFile('./public/broneeri.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)

app.get('/broneeringud', (req, res) => {
  fs.readFile('./public/broneeringud.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)

app.get('/lisa_majutus', (req, res) => {
  if (req.session.loggedIn === true) {
    res.render('lisa_majutus')
  } else {
    res.redirect('/login')
  }
  
});

app.get('/lisa_ruum', (req, res) => {
  fs.readFile('./public/lisa_ruum.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)


app.get('/old_login', (req, res) => {
  fs.readFile('./public/login.html', "utf8", function (err, html) {
    if (err) {
      throw err;
    }
    res.setHeader('content-type', 'text/html');
    res.send(html)
  });
}
)

// Sisselogimise leht
app.get('/login', (req, res) => {
  
  // To avoid undefined error
  var emailMessage = req.flash('user-info');
  var passwordMessage = req.flash('password-info');

  // Kui kasutaja külastab lehte tavaliselt
  if (emailMessage == '' && passwordMessage == '') {
    emailMessage = 'Email'
    passwordMessage = 'Password'

    // Kui parool on vale
  } else if (emailMessage == '') {
    emailMessage = 'Email'

    // Kui kasutaja ei ole andmebaasis
  } else if (passwordMessage == '') {
    passwordMessage = 'Password'
  }

  //console.log(`logging ${emailMessage} and ${passwordMessage}`)
  res.render('login', { emailMessage: emailMessage, passwordMessage: passwordMessage })
  
})

// Authentication page
app.post('/auth', (req, res) => {
  let inputEmail = req.body.email
  let inputPassword = req.body.password

  con.connect(err => {
    con.query("SELECT * FROM konto;", (err, result, fields) => {
      let content = result

      
      if (content.some(item => item['Email'] === inputEmail)) {
        // Kui kasutaja on andmebaasis
        console.log('Existing user detected')
        
        let userDetails = content.filter(item => item['Email'] === inputEmail)[0]

        // Kui kasutaja parool on õige
        if (userDetails.Parool === inputPassword) {
          console.log('successful login')
          req.session.loggedIn = true
          req.session.userID = userDetails['id']
          res.redirect('/')
        
        } else {
          console.log('incorrect password')
          req.flash('password-info', '<span style="color: red;">Password incorrect.</span>')
          res.redirect('/login')
        }
      } else {
        // Kui kasutaja ei ole andmebaasis
        console.log(`New user detected, detected insert ${inputEmail}, detected stored ${content[0]['Email']}`)
        req.flash('user-info', '<span style="color: red;">Email incorrect or not registered.</span>')
        res.redirect('/login')
      }
    })
  })

  
})

// Registreerimis leht
app.get('/register', (req, res) => {
  // To avoid undefined error
  var emailMessage = req.flash('user-info');
  var confirmPasswordMessage = req.flash('confirm-pw-info')
  
  // Kui kasutaja külastab lehte tavaliselt
  if (emailMessage == '' && confirmPasswordMessage == '') {
    emailMessage = 'Email'
    confirmPasswordMessage = 'Confirm password'

    // Kui email on juba andmebaasis registreeritud
  } else if (emailMessage == '') {
    emailMessage = 'Email'

    // Kui sisestatud paroolid on erinevad
  } else if (confirmPasswordMessage == '') {
    confirmPasswordMessage = 'Confirm password'
  }

  res.render('register', { emailMessage: emailMessage, confirmPasswordMessage: confirmPasswordMessage })
  });

app.post('/post-register', (req, res) => {
  let inputEmail = req.body.email
  let inputPassword = req.body.password
  let inputConfirm = req.body['password-confirmation']

  con.connect(err => {
    con.query("SELECT * FROM konto;", (err, result, fields) => {
      let content = result

      if (content.some(item => item['Email'] === inputEmail)) {
        // Kui kasutaja on andmebaasis
        console.log('Existing user detected')
        
        req.flash('user-info', '<span style="color: red;">Email is already registered.</span>')
        res.redirect('/register')

      } else {
        // Kui kasutaja ei ole andmebaasis
        console.log(`New user detected, detected insert ${inputEmail}, detected stored ${content[0]['Email']}`)
        
        if (inputPassword === inputConfirm) {
          
          console.log(`New account created! - Email ${inputEmail}, password ${inputPassword}`)

          con.connect(err => {
            con.query(`INSERT INTO konto (email, parool) VALUES ( '${inputEmail}', '${inputPassword}')`)
          })

          res.redirect('/')

        } else {
          req.flash('confirm-pw-info', `<span style="color: red;">Entered passwords don't match.</span>`)
          
          res.redirect('/register')
        }

      }
    })
  })
})


app.get('/majutusasutused', (req, res) => {
  con.connect(function(err) {
    con.query("SELECT id, Nimi, Pildid FROM Hotell", function(err, result, fields) {
      var content = result;
      //console.log(`logged- ${result.length}`);
      res.render('majutusasutused', { hotel_data: result })
    })
    })
});

app.get('/tartu_hotellid', (req, res) => {
  con.connect(function(err) {
    con.query("SELECT * FROM Hotell", function(err, result, fields) {
      var content = result;
      //console.log(`logged- ${result.length}`);
      res.render('tartu_hotellid', { hotel_data: result })
    })
    })
});

// app start point
app.listen(3000, () => {
  console.log('App is started at http://localhost:3000');
});
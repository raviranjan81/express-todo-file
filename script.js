const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
//how to get data coming from frontend at backend route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    fs.readdir('./file', function (err, files) {
        console.log(files);
        res.render('home', {
            files: files
        })
    });
});

app.get('/file/:filename',function(req,res){
    fs.readFile(`./file/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('show',{
            filename:req.params.filename,filedata:filedata
        })
    })
});

app.get('/edit/:filename',function(req,res){
    fs.readFile(`./file/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('edit',{
            filename:req.params.filename,filedata:filedata
        })
    })
})
app.post('/edit', function(req, res) {
    var title = req.body.title;
    var dec = req.body.dec;
    var path = req.body.path;
    var filePath = `./file/${path}`;

    // Read the existing file
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        // Write a new file with the updated name and data
        fs.writeFile(`./file/${title.split(' ').join('')}.txt`, dec, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating data');
            }

            // Delete the existing file
            fs.unlink(filePath, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error deleting existing file');
                }

                // Redirect to the home page or any other desired location
                res.redirect('/');
            });
        });
    });
});

app.get('/delete/:filename',function(req,res){
    let isDelete=true;
    let path=`./file/${req.params.filename}`;
    if(isDelete){
        fs.unlink(path, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting existing file');
            }
            res.redirect('/');
        });
    }else{
        res.redirect('/');
    }
   
});

app.post('/create',function(req,res){
    fs.writeFile(`./file/${req.body.title.split(' ').join('')}.txt`,req.body.dec,function(err){
        res.redirect('/')
    });
})


app.listen(3000, function (req, res) {
    console.log("server is running at port 3000");
})
const express = require('express');
const router = express.Router();


const pool = require('../database');
const {isloggedIn}=require('../lib/auth');

router.get('/add',isloggedIn,(req,res)=>{
    res.render('links/add');
});
router.post('/add',isloggedIn,async (req, res) => {
    const {title, url, description} = req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?',[newlink]);
    req.flash('success','Links save successfully');
    res.redirect('/links');
});

router.get('/',isloggedIn,async(req,res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]);
    res.render('links/list',{links});
    // res.render('links/vista',{links});
});

router.get('/delete/:id',isloggedIn,async(req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?',[id]);
    req.flash('success','Link deleted successfully');
    res.redirect('/links');

});

router.get('/edit/:id', isloggedIn,async(req,res) => {
    const {id}= req.params;
    const link = await pool.query('SELECT * FROM links WHERE ID = ?',[id]);
    res.render('links/edit',{link: link[0]});
});

router.post('/edit/:id',isloggedIn ,async (req, res) =>{
    const { id } = req.params;
    const {title, description, url } = req.body
    const editlink = {
        title,
        description,
        url
    };
    console.log(editlink);
    await pool.query('UPDATE links SET ? WHERE ID = ?',[editlink, id]);
    req.flash('success','Link edited successfully');
    res.redirect('/links');
});

module.exports = router;
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'

const app = express()
const PORT = 8080

app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/contacts', (req, res) => {
	fs.readFile('./data.json', 'utf-8', (err, data) => {
		if( err ){
			console.log('fetch data error!')
		} else {
			res.send(data)
		}
	})
})
app.post('/contacts', (req, res) => {
	const addedContact = {
		first: req.body.first,
		last: req.body.last,
		id: Math.random()
	}
	fs.readFile('./data.json', 'utf-8', (err, data) => {
		const obj = JSON.parse(data)
		obj[addedContact.id] = addedContact
		fs.writeFile('./data.json', JSON.stringify(obj, null, '\t'), err => {
			if( err ) {
				console.log('add contact error!')
			} else {
				res.send(JSON.stringify(addedContact))
			}
		})
	})
})

app.use('/contacts/:id', (req, res) => {
	const id = req.params.id
	fs.readFile('./data.json', 'utf-8', (err, data) => {
		const obj = JSON.parse(data)
		const contact = obj[id]
		delete obj[id]
		fs.writeFile('./data.json', JSON.stringify(obj, null, '\t'), err => {
			if(err){
				console.log('delete contact error')
			} else {
				res.send(JSON.stringify(contact))
			}
		})
	})
})

app.listen(PORT, () => console.log(`App listen at ${PORT}`))

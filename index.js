import { readFileSync, writeFileSync } from 'fs'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(cors())

async function readDataFromFile() {
	try {
		const data = await readFileSync('data.js', 'utf-8')
		return data;
	} catch(error) {
		throw new Error('Error reading data from file' + error.message)
	}
}

async function writeDataToFile(dataToWrite) {
	writeFileSync('data.js', JSON.stringify(dataToWrite), (err) => {
		if (err) {
			console.error('error writing to file', err)
		} else {
			console.log('data is updated successfully')
		}
	})
}


async function addUserToDb (newUser) {
	const users = await readDataFromFile()
	
	const parsedJson = JSON.parse(users)
	
	console.log(parsedJson)
	
	parsedJson.push(newUser)
	
	writeDataToFile(parsedJson)
	
	return parsedJson;
}

async function removeUser(userId) {
	const users = await readDataFromFile()
	
	const parsedJson = JSON.parse(users)
	
	const udpatedList = parsedJson.filter(user => user.id !== userId)
	writeDataToFile(udpatedList)
	return udpatedList
}

async function getUsers() {
	const users = await readDataFromFile()
	return users
}


app.get('/', (req, res) => {
	res.send(`
		<h2>Welcome</h2>
		<a href='/get-users'>Click here to fetch all users</button>
	`)
})

app.get('/get-users', async (req, res) => {
	const users = await getUsers()
	res.send(users)
})

app.post('/add-user', async (req, res) => {
	const users = JSON.parse(await getUsers())
	const availId = users.length === 0 ? 1 : Number(users.at(-1).id) + 1
	console.log('req body', req.body)
	const result = await addUserToDb({ id: availId, name: req.body.name, profession: req.body.profession })
	res.send(result)
})

app.delete('/delete-user', async (req, res) => {
	const userId = req.body.userId
	const r = await removeUser(userId)
	res.send(r)
})

app.patch('/update-user/:userId', async (req, res) => {
	
	const users = JSON.parse(await getUsers()) 
	const clone = [...users]
		console.log('clone', clone)
	const userFound = clone.find(user => Number(user.id) === Number(req.params.userId))
	console.log('userFound', userFound)
	userFound.name = req?.body?.name
	userFound.profession = req?.body.profession
	writeDataToFile(clone)
	res.send(clone)
})

app.listen('1000', () => {
	console.log('app is running at port 1000')
})
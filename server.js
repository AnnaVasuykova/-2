import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const usersFile = join(__dirname, 'data', 'users.json');
const goodsFile = join(__dirname, 'data', 'goods.json');

function readUsers() {
    const data = readFileSync(usersFile, 'utf8');
    return JSON.parse(data).users;
}

function writeUsers(users) {
    writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
}

function readGoods() {
    const data = readFileSync(goodsFile, 'utf8');
    return JSON.parse(data).goods;
}

function writeGoods(goods) {
    writeFileSync(goodsFile, JSON.stringify({ goods }, null, 2));
}

app.get('/api/users', (req, res) => {
    try {
        const users = readUsers();
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', (req, res) => {
    try {
        const users = readUsers();
        const newUser = {
            ...req.body,
            id: Date.now()
        };
        
        if (users.find(u => u.login === newUser.login)) {
            return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
        }
        
        users.push(newUser);
        writeUsers(users);
        res.json({ user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', (req, res) => {
    try {
        const users = readUsers();
        const index = users.findIndex(u => u.id == req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        users[index] = { ...users[index], ...req.body };
        writeUsers(users);
        res.json({ user: users[index] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', (req, res) => {
    try {
        const users = readUsers();
        const user = users.find(u => u.id == req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Нельзя удалить администратора' });
        }
        
        const filteredUsers = users.filter(u => u.id != req.params.id);
        writeUsers(filteredUsers);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/goods', (req, res) => {
    try {
        const goods = readGoods();
        res.json({ goods });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/goods', (req, res) => {
    try {
        const goods = readGoods();
        const maxId = goods.length > 0 ? Math.max(...goods.map(g => g.id)) : 0;
        const newProduct = {
            ...req.body,
            id: maxId + 1
        };
        
        goods.push(newProduct);
        writeGoods(goods);
        res.json({ product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/goods/:id', (req, res) => {
    try {
        const goods = readGoods();
        const index = goods.findIndex(g => g.id == req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        goods[index] = { ...goods[index], ...req.body };
        writeGoods(goods);
        res.json({ product: goods[index] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/goods/:id', (req, res) => {
    try {
        const goods = readGoods();
        const filteredGoods = goods.filter(g => g.id != req.params.id);
        
        if (filteredGoods.length === goods.length) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        
        writeGoods(filteredGoods);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { login, password } = req.body;
        const users = readUsers();
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/register', (req, res) => {
    try {
        const users = readUsers();
        const { login, password, name, email } = req.body;
        
        if (users.find(u => u.login === login)) {
            return res.status(400).json({ success: false, error: 'Пользователь с таким логином уже существует' });
        }
        
        const newUser = {
            id: Date.now(),
            login,
            password,
            name,
            email,
            role: 'user'
        };
        
        users.push(newUser);
        writeUsers(users);
        res.json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});


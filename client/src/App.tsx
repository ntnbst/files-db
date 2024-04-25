import { useEffect, useState } from 'react'
import './App.css'

const BASE_URL = 'https://animated-robot-5vr9jwv5p6xhp4vg-6000.app.github.dev'

function App() {
  const [isAddOn, setIsAddOn] = useState(false);
  const [isUpdate, setIsUpdate] = useState('');
  const [users, setUsers] = useState([]);
  const [empName, setEmpName] = useState('');
  const [empProfession, setEmpProfession] = useState('');

  useEffect(() => {
    fetch(BASE_URL + '/get-users')
      .then((res) => res.json())
      .then((res) => setUsers(res));
  }, []);

  const handleDelete = async (id: any) => {
    const consentDelete = confirm('Are you sure to delete this user');
    if (consentDelete) {
      fetch(BASE_URL + '/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
        }),
      })
        .then((res) => res.json())
        .then((res) => setUsers(res));
    }
  };

  const handleAddUser = async () => {
    fetch(BASE_URL + '/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: empName,
        profession: empProfession,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        resetForm();
      });
  };

  const handleEdit = async (id: any) => {
    setIsUpdate(id);
    const findObj: any = users.find((user: any) => user.id === id);
    if (findObj) {
      setIsAddOn(true);
      setEmpName(findObj.name);
      setEmpProfession(findObj.profession);
    }
  };

  const handleUpdateUser = async (id: any) => {
    fetch(BASE_URL + `/update-user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: empName,
        profession: empProfession,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        resetForm();
      });
  };

  const resetForm = () => {
    setEmpName('');
    setEmpProfession('');
    setIsAddOn(false);
    setIsUpdate('');
  };

  return (
    <div style={{ padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Users List</h4>
        <Button background='dodgerblue' onClick={() => setIsAddOn(true)}>
          Add User
        </Button>
      </div>
      {isAddOn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="">Name</label>
          <input
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid gray', fontSize: '14px', marginRight: '8px' }}
            type='text'
            placeholder='Enter Name'
            onChange={(e) => setEmpName(e.target.value)}
            value={empName}
          />
          

          <label htmlFor="">Role</label>
          <input
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid gray', fontSize: '14px', marginRight: '8px' }}
            type='text'
            placeholder='Enter Role'
            onChange={(e) => setEmpProfession(e.target.value)}
            value={empProfession}
          />
          

          <label htmlFor="">Admin</label>
          <input type='checkbox' placeholder='Is Admin' />
          {empName && empProfession ? (
            Boolean(isUpdate) ? (
              <Button background='dodgerblue' onClick={() => handleUpdateUser(isUpdate)}>
                Update
              </Button>
            ) : (
              <Button background='dodgerblue' onClick={handleAddUser}>
                Add
              </Button>
            )
          ) : null}
        </div>
      )}
      <br />
      {users?.map((user: any) => (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr auto',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'space-between',
            border: '1px solid #efefef',
            borderRadius: '6px',
            padding: '8px 16px',
            borderCollapse: 'collapse',
            // margin: '16px 0',
          }}
        >
          <span> {user?.id}</span>
          <span>{user?.name}</span>
          <span>{user?.profession}</span>
          <span>{user?.isAdmin ? 'Yes' : 'No'}</span>
          <span>{user?.profession}</span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button background='orange' onClick={() => handleEdit(user?.id)}>
              Edit
            </Button>
            <Button background='red' onClick={() => handleDelete(user?.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App


const Button = ({ children, background = 'skyblue', ...props }: any) => {
  return (
    <button
      {...props}
      style={{
        padding: '8px 32px',
        fontSize: '14px',
        border: 0,
        background,
        borderRadius: '6px',
        color: '#fff',
        fontWeight: '600',
      }}
    >
      {children}
    </button>
  );
};

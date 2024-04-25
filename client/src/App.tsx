import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://animated-robot-5vr9jwv5p6xhp4vg-6000.app.github.dev";

function App() {
  const [isAddOn, setIsAddOn] = useState(false);
  const [isUpdate, setIsUpdate] = useState("");
  const [users, setUsers] = useState([]);
  const [empName, setEmpName] = useState("");
  const [empProfession, setEmpProfession] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "/get-users")
      .then((res) => res.json())
      .then((res) => setUsers(res));
  }, []);

  const handleDelete = async (id: any) => {
    const consentDelete = confirm("Are you sure to delete this user");
    if (consentDelete) {
      fetch(BASE_URL + "/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
    fetch(BASE_URL + "/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
    setEmpName("");
    setEmpProfession("");
    setIsAddOn(false);
    setIsUpdate("");
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "32px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Users List</h4>
          <Button background="dodgerblue" onClick={() => setIsAddOn(true)}>
            Add User
          </Button>
        </div>
        {isAddOn && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="">Name</label>
            <input
              required
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setEmpName(e.target.value)}
              value={empName}
            />

            <label htmlFor="">Role</label>
            <input
              required
              type="text"
              placeholder="Enter Role"
              onChange={(e) => setEmpProfession(e.target.value)}
              value={empProfession}
            />

            <label htmlFor="">Admin</label>
            <input type="checkbox" placeholder="Is Admin" />
            {empName && empProfession ? (
              Boolean(isUpdate) ? (
                <Button
                  background="dodgerblue"
                  onClick={() => handleUpdateUser(isUpdate)}
                >
                  Update
                </Button>
              ) : (
                <Button background="dodgerblue" onClick={handleAddUser}>
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
              display: "grid",
              gridTemplateColumns: "auto 1fr 1fr 1fr 1fr auto",
              alignItems: "center",
              gap: "16px",
              justifyContent: "space-between",
              border: "1px solid #efefef",
              borderRadius: "6px",
              padding: "8px 16px",
              borderCollapse: "collapse",
              // margin: '16px 0',
            }}
          >
            <span> {user?.id}</span>
            <span>{user?.name}</span>
            <span>{user?.profession}</span>
            <span>{user?.isAdmin ? "Yes" : "No"}</span>
            <span>{user?.profession}</span>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button background="orange" onClick={() => handleEdit(user?.id)}>
                Edit
              </Button>
              <Button background="red" onClick={() => handleDelete(user?.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

const Button = ({ children, background = "skyblue", ...props }: any) => {
  return (
    <button
      {...props}
      style={{
        padding: "8px 32px",
        fontSize: "14px",
        border: 0,
        background,
        borderRadius: "6px",
        color: "#fff",
        fontWeight: "600",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
};

function Navbar() {
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);
  const [isSignUp, setIsSingup] = useState(false);
  return (
    <div
      style={{
        background: "pink",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        borderRadius: "6px",
      }}
    >
      <h4 style={{ color: "#000", margin: 0 }}>MX</h4>
      <span style={{ marginLeft: "auto" }}>
        <Button
          background="black"
          onClick={() => {
            setIsLoginWindowOpen((prev) => !prev);
          }}
        >
          Login
        </Button>
      </span>

      {isLoginWindowOpen && (
        <>
          <div className="backdrop"></div>
          <div className="dialog">
            <span
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                cursor: "pointer",
              }}
              onClick={() => setIsLoginWindowOpen(false)}
            >
              ❌
            </span>
            <h4>{isSignUp ? "Sign Up" : "Sign In"} to MX</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {isSignUp && (
                <div>
                  <label htmlFor="">User Name</label>
                  <input type="text" placeholder="Choose A user name" />
                </div>
              )}
              <div>
                <label htmlFor="">Email Id</label>
                <input type="text" placeholder="Enter your E-mail Id" />
              </div>
              <div>
                <label htmlFor="">Password</label>
                <input
                  type="text"
                  placeholder={
                    isSignUp ? "Create your password" : "Enter your password"
                  }
                />
              </div>
              <Button>Submit</Button>
            </div>

            <div>
              {isSignUp ? (
                <p>
                  Already have an Account?
                  <Button
                    style={{ background: "none", marginLeft: "16px" }}
                    onClick={() => setIsSingup(false)}
                  >
                    Sign In
                  </Button>
                </p>
              ) : (
                <p>
                  Dont have an Account?
                  <Button
                    style={{ background: "none", marginLeft: "16px" }}
                    onClick={() => setIsSingup(true)}
                  >
                    Sign up
                  </Button>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

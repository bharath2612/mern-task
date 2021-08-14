import React, { useState, useEffect } from "react";
import GithubUsers from "../components/github/githubUsers";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const response = await fetch("https://api.github.com/users");
      setLoading(false);
      setUsers(await response.json());
    } catch (error) {
      setLoading(false);
      console.log("error" + error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <h1 className="text-danger">Loading...</h1>;
  }

  return (
    <>
      {!users.length ? (
        <div>
          <h4 className="mt-2 text-danger">No data yet</h4>
        </div>
      ) : (
        <GithubUsers users={users} />
      )}
    </>
  );
};

export default Home;

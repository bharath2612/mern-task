import React from "react";
import { FaGithub } from "react-icons/fa";

const githubUsers = ({ users }) => {
  return (
    <div>
      <h2 className="mt-2">List of GitHub Users</h2>
      <div className="container-fluid mt-2">
        <div className="row text-center">
          {users.map((curElem) => {
            const { avatar_url, id, login } = curElem;
            return (
              <div className="col-12 col-md-4 mt-5 cardbox" key={id}>
                <div className="card p-2 shadow">
                  <div className="d-flex align-items-center">
                    <div className="image">
                      <img src={avatar_url} className="rounded d-none d-md-block" width="155" alt="profile pic"/>
                      <img src={avatar_url} className="rounded d-block d-md-none" width="85" alt="profile pic"/>
                    </div>
                    <div className="ml-2 w-100">
                      <h4 className="mb-0 mt-0 textLeft">
                        {login} <FaGithub />
                      </h4>
                      {/* <span className="text-left">{type }</span> */}
                      <div className="p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white stats">
                        <div className="d-flex flex-column">
                          <span className="articles">Articles</span>
                          <span className="number1">38</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="followers">Followers</span>
                          <span className="number2">980</span>
                        </div>
                        <div className="d-flex flex-column">
                          <span className="rating">Rating</span>
                          <span className="number3">8.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default githubUsers;

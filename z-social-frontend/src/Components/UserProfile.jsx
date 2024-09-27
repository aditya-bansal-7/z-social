import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonaryLayout";
import Spinner from "./Spinner";
import { fetchUser } from "../utils/fetchUser";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const [editProfile, setEditProfile] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [imageAsset, setImageAsset] = useState(null);
  const [newUserImage, setNewUserImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
      setNewUserName(data[0].userName); 
      setNewUserImage(data[0].image);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const User = fetchUser();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/jpeg" ||
      type === "image/jpg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], { contentType: type, filename: name })
        .then((document) => {
          setImageAsset(document); 
          setNewUserImage(document.url);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Image upload error: ", error);
          setLoading(false);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
  
    const doc = {
      _id: user._id,
      _type: "user",
      userName: newUserName,
      image: newUserImage,
    };
  
    client
      .patch(user._id) 
      .set(doc)
      .commit()
      .then(() => {
        const nUser = JSON.parse(localStorage.getItem("user"));
        const localUser = { ...nUser, userName: newUserName, image: newUserImage };
  
        const updatedUser = { ...user, userName: newUserName, image: newUserImage };
        setUser(updatedUser);
  
        localStorage.setItem("user", JSON.stringify(localUser));
  
        setEditProfile(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile update failed:", error);
        setLoading(false);
      });
  };
  

  if (!user) {
    return <Spinner msg="Loading user profile" />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      {/* Edit Profile Modal */}
      {editProfile && (
        <div className="flex justify-center z-10 w-full h-screen absolute pointer-events-none bg-gray-800 bg-opacity-50">
          <div className="w-2/5 h-auto mt-20 p-5 flex justify-center items-center pointer-events-auto bg-white z-10 rounded-lg shadow-lg">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-5 text-center">Edit Profile</h2>
              <label className="block mb-3">
                <span className="text-gray-700">Username</span>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </label>

              {/* Profile Image Upload Section */}
              <div className="mb-5">
                <label className="block mb-2">
                  <span className="text-gray-700">Profile Image</span>
                </label>
                <div className="flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-5 h-60 w-full cursor-pointer">
                  {loading && <Spinner />}
                  {wrongImageType && <p className="text-red-500">Invalid file type.</p>}
                  {!imageAsset ? (
                    <label>
                      <div className="flex flex-col items-center justify-center h-full">
                        <AiOutlineCloudUpload className="text-6xl text-gray-400" />
                        <p className="text-lg">Click to upload</p>
                        <p className="mt-4 text-gray-400">Use high-quality JPG, JPEG, PNG less than 20MB</p>
                      </div>
                      <input
                        type="file"
                        name="upload-image"
                        onChange={uploadImage}
                        className="w-0 h-0"
                      />
                    </label>
                  ) : (
                    <div className="relative h-full w-full">
                      <img
                        src={imageAsset?.url}
                        alt="uploaded-pic"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                        onClick={() => setImageAsset(null)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setEditProfile(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
        <div className="flex flex-col justify-center items-center">
              <img  className="w-full h-370 2xl:h-370 shadow-lg object-cover" src="https://images.pexels.com/photos/26853148/pexels-photo-26853148/free-photo-of-pure-lake-by-rocky-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="banner-pic" />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />

            <div className="flex w-full p-4 justify-between">
            {userId === User.googleId && (
                <div className="text-center opacity-0 pointer-events-none flex justify-end mb-7">
                  <button
                    type="button"
                    onClick={() => setEditProfile(!editProfile)}
                    className="bg-red-500 text-white font-bold p-2 rounded-full w-36 outline-none opacity-70 hover:opacity-100"
                  >
                    <p className="flex justify-center items-center gap-2">
                      <MdModeEdit /> Edit Profile
                    </p>
                  </button>
                </div>
              )}
              <h1 className="font-bold text-3xl flex justify-center w-full text-center mt-3">
                {user.userName}
              </h1>
              {userId === User.googleId && (
                <div className="text-center flex justify-end mb-7">
                  <button
                    type="button"
                    onClick={() => setEditProfile(!editProfile)}
                    className="bg-red-500 text-white font-bold p-2 rounded-full w-36 outline-none opacity-70 hover:opacity-100"
                  >
                    <p className="flex justify-center items-center gap-2">
                      <MdModeEdit /> Edit Profile
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User.googleId && (
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={logout}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                onFailure={logout}
                cookiePolicy="single_host_origin"
              />
            )}
          </div>
        </div>

        {/* Buttons to Toggle Created and Saved Pins */}
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        {/* Masonry Layout for Created or Saved Pins */}
        {pins && (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        )}

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
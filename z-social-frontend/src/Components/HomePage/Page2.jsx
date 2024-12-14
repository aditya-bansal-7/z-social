import React, { useState, useEffect, useRef } from "react";
import { page2GridArray } from "../../utils/constants";
import ReactPlayer from "react-player";
import "./Page2.css";
import { fetchUser } from "../../utils/fetchUser";
import { Link } from "react-router-dom";

const Page2 = () => {
  const galleryRef = useRef(null);
  const [items, setItems] = useState([]);

  const userInfo = fetchUser();

  useEffect(() => {
    const generateItems = () => {
      const rows = [
        { id: 0, count: 4 },
        { id: 1, count: 3 },
        { id: 2, count: 4 },
      ];

      const newItems = rows.map((row) => {
        return Array.from({ length: row.count }, (_, i) => {
          const itemId = `${row.id}-${i}`;
          const video = page2GridArray.find((v) => v.id === itemId);
          return {
            id: itemId,
            row: row.id,
            previewImg: video ? video.previewImg : "",
            videoTitle: video ? video.videoTitle : "",
            videoId: video ? video.videoId : "",
          };
        });
      });
      setItems(newItems);
    };
    generateItems();

    const handleMouseMove = (e) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height } = currentTarget.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;

      const sensitivity = 1;

      const deltaX = (centerX - clientX) / sensitivity;
      const deltaY = (centerY - clientY) / sensitivity;

      galleryRef.current.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
    };

    const container = document.querySelector(".cnnt");
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="absolute pointer-events-none z-10 flex justify-center flex-col overflow-hidden items-center h-screen w-screen">
        <button
          onClick={
            (e) => {
              e.preventDefault();
              window.open("https://github.com/aditya-bansal-7/z-social", "_blank");
            }
          }
          target="_blank"
          className="flex pointer-events-auto top-10 overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2">
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
          <div className="flex items-center">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
              <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
            </svg>
            <span className="ml-1 text-white">Star on GitHub</span>
          </div>
          <div className="ml-2 flex items-center gap-1 text-sm md:flex">
            <svg
              className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
              data-slot="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                fillRule="evenodd"></path>
            </svg>
            <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
              1
            </span>
          </div>
        </button>

        <div className="flex h-[200vh] gap-10  w-full flex-col justify-center items-center">
          <h1 className="text-9xl font-bold text-white">Z-Social</h1>{" "}
          {/* will make this 3d intractive */}
          <p className="text-xl text-white">
            A social media platform where users can share image to each other
          </p>
        </div>
        <div className="flex flex-col justify-start items-center w-full h-full">
          <Link to={userInfo ? "/explore" : "/login"}>
            <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div className="relative z-10 flex pointer-events-auto items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1">
                    Let's get started
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      fillRule="evenodd"></path>
                  </svg>
                </div>
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className="cnnt relative h-screen bg-black w-screen overflow-hidden">
        <div className=" gallery " ref={galleryRef}>
          {items.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row">
              {row.map((item) => (
                <div
                  key={item.id}
                  className="item relative w-[400px] h-[275px] overflow-hidden ">
                  <div className="preView-img">
                    <img
                      className=" w-full h-full object-cover "
                      src={item.previewImg}
                      alt={item.videoTitle}
                    />
                  </div>
                  <p className="video-title">{item.videoTitle}</p>
                  <div className="video-container absolute top-0 left-0 w-full h-full ">
                    {item.videoId ? (
                      <ReactPlayer
                        url={`https://vimeo.com/${item.videoId}`}
                        controls={false}
                        autoPlay={true}
                        loop={true}
                        playing
                        muted
                        width="100%"
                        height="100%"
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page2;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "../component/Footer";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "../component/ProgressBar";
import { dispatch, useSelector } from "../store";
import axios from "../utils/api";
import "../css/font.css";
import "../css/spread.css";
import {
  insertWallet,
  updateWallet,
  updateEnergy,
  getWallet,
} from "../store/reducers/wallet";

function Home() {
  const usernameState = useSelector((state) => state.wallet.user?.username);
  const tokenState = useSelector((state) => state.wallet.user?.balance);
  const energyState = useSelector((state) => state.wallet.user?.energy);
  const tapState = useSelector((state) => state.wallet.user?.tap);
  const limitState = useSelector((state) => state.wallet.user?.limit);
  const [imgStatus, setImgStatus] = useState(false);
  const [tap, setTap] = useState<number>(tapState);
  const [username, setUsername] = useState<string>(usernameState);
  const [token, setToken] = useState<number>(tokenState);
  const [remainedEnergy, setRemainedEnergy] = useState<number>(energyState);
  const [limit, setLimit] = useState<number>(limitState);
  useEffect(() => {
    const webapp = (window as any).Telegram?.WebApp.initDataUnsafe;
    // console.log("=========>webapp", webapp);
    if (webapp) {
      setUsername(webapp["user"]["username"]);
      axios.post(`/vibe/add,`, { username: webapp["user"]["username"] });
      axios.post(`/earnings/add`, { username: webapp["user"]["username"] });
      dispatch(insertWallet(webapp["user"]["username"]));
      dispatch(getWallet(webapp["user"]["username"])).then(() => {
        setTap(tapState);
        setToken(tokenState);
        setRemainedEnergy(energyState);
      });
    }
  }, []);
  console.log("---Telegram info----->", username);
  useEffect(() => {
    setLimit(limitState);
  }, [limitState]);
  useEffect(() => {
    dispatch(insertWallet(username));
  }, [username]);
  function formatNumberWithCommas(number: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(number);
  }
  const bodyRef = useRef<HTMLImageElement>(null);
  const [score, setScore] = useState<string>(`+${tap}`);
  const handleClick = (event: any) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.random() * (event.clientX - rect.left);
    const y = Math.random() * (event.clientY - rect.top);

    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    styleElement.sheet &&
      styleElement.sheet.insertRule(
        "@keyframes fade-out-top-right {0% {opacity: 1; transform: translateY(0); } 100% {opacity: 0;transform: translateY(-100%);}}",
        0
      );

    const newDiv = document.createElement("div");
    newDiv.textContent = `${score}`;
    newDiv.style.backgroundImage = "url('image/dollar.png')";
    newDiv.style.backgroundRepeat = "no-repeat";
    newDiv.style.backgroundPosition = "center";
    newDiv.style.fontSize = "30px";
    newDiv.style.paddingLeft = "30px";
    newDiv.style.display = "flex";
    newDiv.style.justifyContent = "center";
    newDiv.style.alignItems = "center";
    newDiv.style.backgroundSize = "cover";
    newDiv.style.width = "40px";
    newDiv.style.height = "40px";
    newDiv.style.position = "absolute";
    newDiv.style.left = `${x + 50}px`;
    newDiv.style.top = `${y}px`;
    newDiv.style.color = score == "+1" ? "#58E1E2" : "red";
    newDiv.className =
      "dynamic-div animate-fadeouttopright transform max-sm:text-3xl text-5xl font-bold transition not-selectable";

    bodyRef.current && bodyRef.current.appendChild(newDiv);
    const interval = setTimeout(() => newDiv && newDiv.remove(), 1000);

    return () => clearTimeout(interval);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("-information---->", username, remainedEnergy);
      if (remainedEnergy < limit) {
        dispatch(updateEnergy(username, remainedEnergy + 1));
      }
    }, 216000);
    return () => clearInterval(interval);
  }, [username, remainedEnergy, limit]);

  const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (remainedEnergy > 0 && token < 1000000000) {
      setScore(`+${tap}`);
      if (token + tap > 1000000000) {
        setToken(1000000000);
        dispatch(updateWallet(username, 1000000000, remainedEnergy - tap));
      } else {
        setToken(token + tap);
        if (remainedEnergy - tap < 0) {
          dispatch(updateWallet(username, token + tap, 0));
          setRemainedEnergy(0);
        } else {
          dispatch(updateWallet(username, token + tap, remainedEnergy - tap));
          setRemainedEnergy(remainedEnergy - tap);
        }
      }

      handleClick(event);
    }
  };
  const handleMouseDown = () => {
    setImgStatus(true);
  };
  const handleMouseLeave = () => {
    setImgStatus(false);
  };
  console.log("imgStatus", imgStatus);
  return (
    <div className="flex flex-col justify-between items-center h-full w-full">
      <ToastContainer />
      <div className="w-[90%] flex flex-col justify-center items-center gap-4">
        <div className="flex justify-between items-center px-3 w-full">
          <h3
            className="text-2xl font-bold text-[white]"
            style={{ fontFamily: "spicy" }}
          >
            Hello, {username}
          </h3>
          <img src="image/gts.png" alt="" className=" w-10 h-10" />
        </div>
        <div className="flex justify-between items-center w-full px-3 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-[#7B34EF] to-[#2A0E58]">
          <div className=" flex justify-center items-center p-2 ">
            <img src="/image/assets/coin.png" alt="" className=" w-7 h-7" />
            <div className="flex flex-col justify-center items-center">
              <h2 className=" text-sm text-[#FFC107]">Earn Per Tap</h2>
              <h2 className="text-sm text-[white]">+{tap} Poin</h2>
            </div>
          </div>
          <div className=" flex justify-center items-center p-2 ">
            <img src="/image/assets/earnLevel.png" alt="" className=" w-7 h-7" />
            <div className="flex flex-col justify-center items-center">
              <h2 className=" text-sm text-[#FFC107]">Earn to level up</h2>
              <h2 className="text-sm text-[white]"> {formatNumberWithCommas(10000)}k</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center p-3 gap-2">
        <ProgressBar value={100} />
        <div className="flex w-full justify-between items-center p-3">
          <h1 className="text-sm text-white">Level epic</h1>
          <h1 className="text-sm text-white">Goal 8/10</h1>
        </div>
      </div>
      <div className="flex justify-center items-center relative h-[45vh] w-full">
        <img className="flex justify-center items-center absolute w-auto h-[90%] z-10 bg-cover bg-no-repeat bottom-[15%]" src="/image/tap-image/cashtree_bg.png">
        </img>
        <div className="absolute flex justify-center items-center z-20 top-0">
          <img src="image/assets/coin.png" alt="" className=" w-16 h-16" />
          <h1
            className=" text-5xl text-white font-bold"
            style={{ fontFamily: " archivo" }}
          >
            {formatNumberWithCommas(token)}
          </h1>
        </div>
        <img
          className={`absolute rounded-full bg-cover z-50 w-auto h-[100%] bottom-[-10%] ${remainedEnergy > 0
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50 "
            } ${imgStatus ? " border-[5px]" : "border-0"}
            `}
          ref={bodyRef}
          src="/image/tap-image/cashtree.png"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseLeave}
          onClick={handleTap}
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full gap-2">
        <div className="flex flex-col justify-center items-center content-center w-full">
          <div className="flex justify-between w-full items-center px-3">
            <div className=" my-2 w-[fit-content] flex">
              <img
                src="/image/assets/energy.png"
                alt="lightning"
                className="w-6 h-6 inline"
              />
              <p className="text-xl text-white">
                {remainedEnergy} &#8725; {limit}
              </p>
            </div>
            <div className=" my-2 w-[fit-content] flex">
              <img
                src="/image/assets/boost.png"
                alt="lightning"
                className="w-6 h-6 inline"
              />
              <p className="text-xl text-white">
                Boost
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;

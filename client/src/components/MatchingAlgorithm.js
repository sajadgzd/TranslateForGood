import React, { useEffect, useState } from "react";
import axios from "axios";

const MatchingAlgorithm = (props) => {

    const [data, setData] = useState({
      id: "",
      urgentTranslatorBool: false,
      femaleTranslatorBool: false,
      documentProofReadingBool: false,
      isActive: true,
      author: "",
      languageFrom: "",
      languageTo: "",
    });

const getLatestRequest = async () => {
        const reqs = await axios.get("/api/requests/latest");
        setData(reqs.data);
        console.log(reqs.data);
      };
};
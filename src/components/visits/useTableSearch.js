import { useState, useEffect } from "react";
import axios from '../../axiosApi';
function useTableSearch (searchVal, retrieve) {
  const [filteredData, setFilteredData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);

  const crawl = (visit, allValues) => {
    if (!allValues) allValues = [];
    for (var key in visit) {
      if (typeof visit[key] === "object") {crawl(visit[key], allValues);}
      else if (key==='full_name') allValues.push(visit[key] + " ");
    }
    return allValues;
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data: visits } = await axios.get('api/visit');
      setOrigData(visits);
      setFilteredData(visits);
      const searchInd = visits.map(visit => {
        const allValues = crawl(visit);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
    };
    fetchData();
  }, [retrieve]);

  useEffect(() => {
    if (searchVal) {
      const reqData = searchIndex.map((visit, index) => {
        if (visit.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
          return origData[index];
        return null;
      });
      setFilteredData(
        reqData.filter(visit => {
          if (visit) return true;
          return false;
        })
      );
    } else setFilteredData(origData);
  }, [searchVal, origData, searchIndex]);

  return [filteredData];
};

export default useTableSearch;
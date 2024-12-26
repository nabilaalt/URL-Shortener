/* eslint-disable react-hooks/exhaustive-deps */
// can add sonner from shadcn ui after link created

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [urls, setUrls] = useState([]);
  const session = JSON.parse(localStorage.getItem("decodedToken"));
  const {
    loading,
    error,
    data: fetchedUrls,
    fn: fnUrls,
  } = useFetch(getUrls, session.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls, session.id);

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (fetchedUrls) {
      setUrls(fetchedUrls);
    }
  }, [fetchedUrls]);

  const handleNewUrl = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls]);

  console.log("total clicks", clicks);

  return (
    <div className="flex flex-col gap-8 sm p-5">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.total_clicks || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold">My Links</h1>
        <CreateLink onNewUrl={handleNewUrl} />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;

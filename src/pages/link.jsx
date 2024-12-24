/* eslint-disable react-hooks/exhaustive-deps */
import DailyClicks from "@/components/daily-click";
import DeviceStats from "@/components/device-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const URL_APP = import.meta.env.VITE_APP_URL;

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, data: url, fn, error } = useFetch(getUrl, { id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    if (!url) fn(); // Fetch hanya sekali
  }, [url]);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  let link = "";
  if (url) {
    link = url?.shortUrl;
  }

  const dailyClicks =
    stats?.daily_clicks?.[new Date().toISOString().split("T")[0]]?.clicks || 0;

  const weeklyClicks =
    stats?.weekly_clicks?.[`2024-W${Math.ceil(new Date().getDate() / 7)}`]?.clicks ||
    0;
    
  const monthlyClicks =
    stats?.monthly_clicks?.[new Date().toISOString().split("-").slice(0, 2).join("-")].clicks || 0;

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between px-4 sm:px-8 py-6">
        {/* Left Section */}
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-4xl sm:text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title || "Loading..."}
          </span>

          <a
            href={`${URL_APP}/${link}`}
            target="_blank"
            className="text-2xl sm:text-3xl text-rose-400 font-bold hover:underline cursor-pointer"
          >
            {URL_APP}/{link || "Loading..."}
          </a>

          <a
            href={url?.originalUrl || "#"}
            target="_blank"
            className="truncate w-full flex items-center hover:underline cursor-pointer"
          >
            <LinkIcon/>
            {url?.originalUrl || "Loading..."}
          </a>

          <span className="flex items-end font-extralight text-sm">
            {url ? new Date(url?.createdAt).toLocaleString() : "Loading..."}
          </span>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`${URL_APP}/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>

          {/* QR Code */}
          <img
  src={url?.qr || "placeholder-image-url"}
  className="sm:w-30 md:w-64 lg:w-48 self-center sm:self-start ring ring-rose-300 p-1 object-contain"
  alt="qr code"
/>
        </div>

        {/* Right Section (Stats) */}
        <Card className="sm:w-3/5 w-full">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center">Statistics</CardTitle>
          </CardHeader>

          {stats && stats?.message === "No clicks yet" ? (
            <CardContent>No Statistics Yet</CardContent> 
          ) : stats ? (
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Clicks */}
                <Card className="p-4 shadow-md border border-rose-100 rounded-md">
                  <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">
                      {stats?.total_clicks || 0}
                    </p>
                  </CardContent>
                </Card>

                {/* Daily Clicks */}
                <Card className="p-4 shadow-md border border-rose-100 rounded-md">
                  <CardHeader>
                    <CardTitle>Daily Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{dailyClicks}</p>
                  </CardContent>
                </Card>

                {/* Weekly Clicks */}
                <Card className="p-4 shadow-md border border-rose-100 rounded-md">
                  <CardHeader>
                    <CardTitle>Weekly Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{weeklyClicks}</p>
                  </CardContent>
                </Card>

                {/* Monthly Clicks */}
                <Card className="p-4 shadow-md border border-rose-100 rounded-md">
                  <CardHeader>
                    <CardTitle>Monthly Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{monthlyClicks}</p>
                  </CardContent>
                </Card>
              </div>

              <CardTitle>Daily Clicks Trend</CardTitle>
              <DailyClicks stats={stats} />

              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics Yet"
                : "Loading Statistics..."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;

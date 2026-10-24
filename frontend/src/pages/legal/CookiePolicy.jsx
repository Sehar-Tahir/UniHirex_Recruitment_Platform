
import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function CookiePolicy() {
const lastUpdated = new Date().toLocaleDateString("en-US", {
month: "long",
year: "numeric",
});

return (
<StaticPageLayout
title="Cookie Policy"
subtitle={`Last updated ${lastUpdated}`}
> <p className="mb-5 leading-7">
At UniHirex, we aim to be transparent about how information is stored
when you use our platform. UniHirex may use browser storage, such as
local storage, to support platform functionality and improve your
experience. </p>


  <p className="mb-6 leading-7">
    Local storage may be used to retain information such as login-related
    data, saved jobs, saved candidates, or user preferences. Unlike cookies,
    local storage data is stored in your browser and is not automatically
    sent to the server with every request. The information stored depends
    on the features you use.
  </p>

  <h3
    className="text-lg font-semibold mb-2"
    style={{ ...fontHead, color: COLORS.textDark }}
  >
    Cookies and Similar Technologies
  </h3>

  <p className="mb-6 leading-7">
    This policy describes our use of browser storage. If UniHirex introduces
    cookies or other tracking technologies in the future, we will update
    this policy to explain their purpose and how they are used.
  </p>

  <h3
    className="text-lg font-semibold mb-2"
    style={{ ...fontHead, color: COLORS.textDark }}
  >
    Managing Your Data
  </h3>

  <p className="mb-6 leading-7">
    You can manage or clear locally stored information through your
    browser's site settings for UniHirex. Clearing this information may
    sign you out or remove locally saved preferences. Logging out may also
    clear certain login-related data, depending on how the platform
    handles your session.
  </p>

  <h3
    className="text-lg font-semibold mb-2"
    style={{ ...fontHead, color: COLORS.textDark }}
  >
    Policy Updates
  </h3>

  <p className="leading-7">
    We may update this policy as UniHirex develops or its use of storage
    technologies changes. Any revisions will be published on this page
    with an updated revision date.
  </p>
</StaticPageLayout>


);
}

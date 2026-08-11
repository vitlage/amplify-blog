"use client";
import React from "react";

// Shared "Try it in your inbox" form, extracted from the home page so the
// personalized lead landing page reuses the exact same markup, styles and
// send pipeline (convertic.ai /landing/templates/send/{email}/{templateId}).
//
// Props:
//   showTemplateOptions  render the 3 template radio buttons (home page) or not (lead page)
//   templateId           fixed template id used when radios are hidden (lead page)
//   heading              optional custom heading node (defaults to the home "Try it in your inbox:")
//   onResult             ({ status, msg, email }) callback fired after each send attempt
export default function TryItInInbox({
  showTemplateOptions = true,
  showHeading = true,
  templateId = "66c37609b2af3",
  heading = null,
  onResult,
  // "lead" mode POSTs to this app's send-proxy, which bakes click/submit tracking
  // into the lead's own AMP HTML before forwarding it to the delivery service.
  mode = "campaign",
  token = "",
  templateKey = "",
}) {
  const [loading, setLoading] = React.useState(false);

  const onTryItInputFocus = () => {
    document
      .querySelector(".all_faq_input_send")
      ?.classList.add("all_faq_input_send_focus");
  };
  const onTryItInputBlur = () => {
    document
      .querySelector(".all_faq_input_send")
      ?.classList.remove("all_faq_input_send_focus");
  };

  const submitForm = (e) => {
    e.preventDefault();
    const mainInputAlert = document.querySelector("#alert-message");
    const mainInputElement = document.querySelector(".all_faq_input");

    const formData = new FormData(e.currentTarget);
    const formObject = {};
    formData.forEach((value, key) => (formObject[key] = value));

    const email = formObject.main_input?.trim();
    const template = formObject.template_option || templateId;

    if (window.analytics) {
      window.analytics.track("User submitted Try it in your inbox: ", { email });
    }

    const displayAlert = (r) => {
      const msg = (r.msg || "").replace(/📥/g, "").trim();
      if (mainInputAlert) {
        mainInputAlert.innerHTML = `<div class="alert alert-${r.status} animate__animated animate__fadeIn">${msg}</div>`;
      }
      if (window.analytics) {
        if (r.status === "danger") {
          window.analytics.track("Email NOT sent to Try it in your inbox: ", {
            email,
          });
        } else {
          window.analytics.track("Email sent to Try it in your inbox: ", {
            email,
          });
        }
      }
      if (mainInputElement) mainInputElement.value = "";
      if (onResult) onResult({ ...r, email });
    };

    if (!email) {
      displayAlert({ status: "danger", msg: "Please enter your email address" });
      return;
    }

    const handle = (promise) =>
      promise
        .then(async (response) => {
          // Read the JSON body even on non-2xx: the API returns a meaningful
          // { status, msg } for validation / invalid-link errors, and that reason
          // is far more useful than a generic "something went wrong".
          const data = await response.json().catch(() => null);
          if (data && (data.status || data.msg)) return data;
          if (!response.ok) throw new Error("HTTP error: " + response.status);
          return data || {};
        })
        .then((data) => displayAlert(data))
        .catch(() =>
          displayAlert({
            status: "danger",
            msg: "Oops, Something went wrong. Please, try it later",
          })
        )
        .finally(() => setLoading(false));

    if (mode === "lead") {
      if (!token) {
        displayAlert({ status: "danger", msg: "This link is no longer valid." });
        return;
      }
      // Send via this app's proxy: it reads the chosen AMP HTML server-side, bakes
      // in click/submit tracking, then forwards to the delivery service.
      const body = new URLSearchParams({ email });
      if (templateKey) body.set("template", templateKey);
      setLoading(true);
      handle(
        fetch(`/api/lead/${encodeURIComponent(token)}/send`, {
          method: "POST",
          body,
        })
      );
      return;
    }

    setLoading(true);
    handle(
      fetch(
        `https://app.convertic.ai/landing/templates/send/${encodeURIComponent(
          email
        )}/${encodeURIComponent(template)}`
      )
    );
  };

  return (
    <>
      <form className="all_build" onSubmit={submitForm}>
        {(showHeading || showTemplateOptions) && (
        <div className="col-12">
          <div className="row">
            {showHeading && (
            <div className="col-12 col-lg-6 all_faq_header_flex">
              {heading || (
                <>
                  <h1 className="all_faq_header_bold all_faq_header_container">
                    Try it &nbsp;
                    <span className="all_faq_header_gradient"></span>
                  </h1>
                  <h1 className="all_faq_header_bold"> in your inbox:</h1>
                </>
              )}
            </div>
            )}
            {showTemplateOptions && (
              <div className="col-12 col-lg-6 d-flex button_radio_container">
                <div className="button_radio_wrapper">
                  <label className="button_radio" htmlFor="first_option">
                    <input
                      type="radio"
                      name="template_option"
                      id="first_option"
                      value="66c37609b2af3"
                      defaultChecked
                    />
                    <span>First template</span>
                  </label>
                  <label className="button_radio" htmlFor="second_option">
                    <input
                      type="radio"
                      name="template_option"
                      id="second_option"
                      value="66c373e4562c5"
                    />
                    <span>Second template</span>
                  </label>
                  <label className="button_radio" htmlFor="third_option">
                    <input
                      type="radio"
                      name="template_option"
                      id="third_option"
                      value="66c37695e547d"
                    />
                    <span>Third template</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        <h2 className="all_faq_question_header"></h2>
        <input
          className="all_faq_input"
          onFocus={onTryItInputFocus}
          onBlur={onTryItInputBlur}
          id="main_input"
          name="main_input"
          type="email"
          required
          placeholder="Leave your email address here to check out how it works in your inbox"
        />
        <button
          type="submit"
          className="all_faq_input_send"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className="all_faq_input_spinner" aria-hidden="true"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
              className="h-4 w-4 m-1 md:m-0"
              strokeWidth="2"
            >
              <path
                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
        </button>
      </form>

      <div id="alert-message"></div>
    </>
  );
}

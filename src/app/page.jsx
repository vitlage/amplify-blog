"use client";
import './global.css';
import { useEffect, useState } from "react";

export default function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  const [faqItemOpen, setFaqItemOpen] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      const section = document.querySelector('.horizontal-sticky');
      const offsetTop = section.parentElement.offsetTop;
      const scrollSection = document.querySelector('.horizontal-block');
      let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;

      percentage = percentage < 0 ? 0 : percentage > 177 ? 177 : percentage;
      scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const dynamicText = document.querySelector(".higlighted_header");
    const highLightedWords = ["interactive", "app-like", "convertic"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {      
      const currentWord = highLightedWords[wordIndex];
      const currentChar = currentWord.substring(0, charIndex);
      dynamicText.textContent = currentChar;
      // dynamicText.classNameList.add("stop-blinking");
  
      if(!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 200);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 100);
      } else {
        isDeleting = !isDeleting;
        // dynamicText.classNameList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % highLightedWords.length : wordIndex;
        setTimeout(typeEffect, 1200);
      }
    }

    typeEffect();
  }, []);

  const onTryItClickable1 = () => {
    document.querySelector(".clickable_modal1").style.display = "block";
  };

  const onTryItClickable2 = () => {
    document.querySelector(".clickable_modal2").style.display = "block";
  };

  const onTryItClickable3 = () => {
    document.querySelector(".clickable_modal3").style.display = "block";
  };

  const onTryItClickableClose = () => {
    document.querySelector(".clickable_modal1").style.display = "none";
  }

  const onTryItClickableClose2 = () => {
    document.querySelector(".clickable_modal2").style.display = "none";
  }

  const onTryItClickableClose3 = () => {
    document.querySelector(".clickable_modal3").style.display = "none";
  }

  const faqItemClick = (item) => {
    setFaqItemOpen(item);
  };

  const onTryItInputFocus = () => {
    document.querySelector(".all_faq_input_send").classList.add("all_faq_input_send_focus");
  };

  const onTryItInputBlur = () => {
    document.querySelector(".all_faq_input_send").classList.remove("all_faq_input_send_focus");
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("inside submitForm: ", e);
    const mainInputAlert = document.querySelector("#alert-message");
    const mainInputElement = document.querySelector(".all_faq_input");
    var formData = new FormData(e.target);
    var formObject = {};

    formData.forEach(function(value, key) {
        formObject[key] = value;
    });

    if (window.analytics) {
      analytics.track("User submitted Try it in your inbox: ", {
        email: mainInputElement.value,
      });
    }

    const displayAlert = (r) => {
    mainInputAlert.innerHTML = `<div class="alert alert-${r.status} animate__animated animate__fadeIn">${r.msg}</div>`;

    if (window.analytics) {
      if (r.status === 'danger') {
        console.log('mainInputElement.value1: ', mainInputElement.value);
        analytics.track("Email NOT sent to Try it in your inbox: ", {
          email: mainInputElement.value,
        });
      } else {
        console.log('mainInputElement.value2: ', mainInputElement.value);
        analytics.track("Email sent to Try it in your inbox: ", {
          email: mainInputElement.value,
        });
      }
    }

    mainInputElement.value = '';
  }

  fetch(`https://app.convertic.ai/landing/templates/send/${formObject.main_input}/${formObject.template}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Помилка HTTP: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          displayAlert(data);
      })
      .catch(error => {
          displayAlert({status: 'danger', 'msg': 'Oops, Something went wrong. Please, try it later'});
      })
  }

  return (
    <div>
      <header className="row header">
          <div className="col-12 above">
              <div className="row">
                  <div className="col p-4">
                      <nav className="navbar">
                          <div className="container-fluid"></div>
                      </nav>
                  </div>
              </div>
              <div className="row pt-5 header_title">
                  <div className="col centeredElement">
                      <div className="centeredElement">
                          <h1 className="header_title_text">
                            <span>Welcome to the allure&nbsp;</span><br />
                            <span className="higlighted_header">interactive</span> 
                            <span> emails era</span>
                          </h1>
                      </div>
                  </div>
              </div>
              <div className="all_first_cta">
                  <a href="https://app.convertic.ai/users/register" onClick={() => onregisterclick(1)} className="all_menu_button">Get started</a>
                  <div onClick={() => onregisterclick(1)} id="request_demo_btn" className="all_menu_button all_menu_button_secondary">
                      Request a demo
                  </div>
              </div>
          </div>
      </header>
      <div className="row my-5">
        <div className="col above">
            <div className="horizontal_parent">
                <div className="horizontal-sticky">
                    <div className="horizontal-block">
                        <div className="hor-element first-hor-element"></div>
                        <div className="hor-element">
                            <div className="hor_circle2">
                                <div className="hor_circle_inner"></div>
                            </div>
                            <div className="whole_screen_text whole_screen_text_small">
                                Do you want to increase revenue from <span className="whole_screen_text_color">email marketing?</span>
                            </div>
                            
                        </div>
                        <div className="hor-element first-hor-element"></div>
                        <div className="hor-element">
                            <div className="hor_circle">
                                <div className="hor_circle_inner"></div>
                            </div>
                            <div className="whole_screen_text whole_screen_text_small">
                                Start to use interactive emails to <span className="whole_screen_text_color">skyrocket</span> sales and customer loyalty for your brand
                            </div>
                        </div>
                        <div className="hor-element first-hor-element">

                        </div>
                        <div className="hor-element">
                            <div className="hor_circle3">
                                <div className="hor_circle_inner"></div>
                            </div>
                            <div className="whole_screen_text whole_screen_text_small">
                                Scroll to check the <span className="whole_screen_text_color">use cases</span> of how you can implement interactive emails in your business
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div>
                <section className="section whole_screen_text">
                    <div>
                        Increase revenue from <span className="whole_screen_text_color">shopping</span> in email
                    </div>
                    <div className="whole_screen_right">
                        <div className="whole_screen_right_top"></div>
                        <video width="670" height="900" src="/vid.mov" type="video/quicktime" autoPlay muted loop playsInline>
                            <source src="/vid.mov" type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="whole_screen_right_bottom">
                            <button onClick={onTryItClickable1} className="all_menu_button try_it_clickable try_it_clickable1">Try it clickable</button>
                        </div>
                    </div>
                    <div className="clickable_modal clickable_modal1">
                        <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross1"
                          onClick={onTryItClickableClose}
                        >
                            <div className="all_faq_item_plus_inner">+</div>
                        </div>
                        <iframe className="hor_iframe" src="/shop.html"></iframe>
                    </div>
                </section>
                <section className="section whole_screen_text">
                    <div>
                        Get more <span className="whole_screen_text_color3">social proof</span> from in-email review forms
                    </div>
                    <div className="whole_screen_right">
                        <div className="whole_screen_right_top"></div>
                        <video width="670" height="900" src="/feedback.mov" type="video/quicktime" autoPlay muted loop playsInline>
                            <source src="/feedback.mov" type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="whole_screen_right_bottom">
                            <button onClick={onTryItClickable2} className="all_menu_button try_it_clickable try_it_clickable2">Try it clickable</button>
                        </div>
                    </div>
                    <div className="clickable_modal clickable_modal2">
                        <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross2"
                          onClick={onTryItClickableClose2}>
                            <div className="all_faq_item_plus_inner">+</div>
                        </div>
                        <iframe className="hor_iframe" src="/feedback.html"></iframe>
                    </div>
                </section>
                <section className="section whole_screen_text">
                    <div>
                        Create in-email bundles, subscriptions and measure <span className="whole_screen_text_color">NPS</span>
                    </div>
                    <div className="whole_screen_right">
                        <div className="whole_screen_right_top"></div>
                        <video width="670" height="900" src="/upsell.mov" type="video/quicktime" autoPlay muted loop playsInline>
                            <source src="/upsell.mov" type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="whole_screen_right_bottom">
                            <button onClick={onTryItClickable3} className="all_menu_button try_it_clickable try_it_clickable3">Try it clickable</button>
                        </div>
                    </div>
                    <div className="clickable_modal clickable_modal3">
                        <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross3"
                          onClick={onTryItClickableClose3}>
                            <div className="all_faq_item_plus_inner">+</div>
                        </div>
                        <iframe className="hor_iframe" src="/upsell.html"></iframe>
                    </div>
                </section>
            </div>
            <div className="row my-5">
                <div className="col above">
                    <div className="container">
                        <div className="row">
                            <form className="all_build" onSubmit={() => submitForm(e)}>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 col-lg-6 all_faq_header_flex">
                                            <h1 className="all_faq_header_bold all_faq_header_container">
                                                Try it &nbsp;
                                                <span className="all_faq_header_gradient"></span>
                                            </h1>
                                            <h1 className="all_faq_header_bold"> in your inbox:</h1>
                                        </div>
                                        <div className="col-12 col-lg-6 d-flex">
                                            <div className="button_radio_wrapper">
                                                <label className="button_radio" htmlFor="first_option">
                                                    <input type="radio" name="template_option" id="first_option" value="66c37609b2af3" defaultChecked />
                                                    <span>First template</span>
                                                </label>
                                                <label className="button_radio" htmlFor="second_option">
                                                    <input type="radio" name="template_option" id="second_option" value="66c373e4562c5" />
                                                    <span>Second template</span>
                                                </label>
                                                <label className="button_radio" htmlFor="third_option">
                                                    <input type="radio" name="template_option" id="third_option" value="66c37695e547d" />
                                                    <span>Third template</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="all_faq_question_header"></h2>
                                <input className="all_faq_input"
                                  onFocus={onTryItInputFocus}
                                  onBlur={onTryItInputBlur}
                                  id="main_input" 
                                  name="main_input"
                                  type="email" 
                                  required 
                                  placeholder="Leave your email address here to check out how it works in your inbox"
                                />
                                <button type="submit" className="all_faq_input_send">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4 m-1 md:m-0" strokeWidth="2"><path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg>
                                </button>
                            </form>

                            <div id="alert-message"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="all_container">
                                    <div className="all_faq">
                                        <h1 className="all_faq_header_bold">FAQ:</h1>
                                        <div className="all_faq_container">
                                            <div className="all_faq_item" onClick={() => faqItemClick(0)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">How does Convertic works?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 0 && (<div className="all_faq_item_answer">Convertic provides different interactive emails service which improve conversion of email campaingns and increase AOV. For example your email subscribers can add additional products to the cart right inside email, or leave feedback without leaving inbox. <br /></div>)}
                                            </div>
                                            <div className="all_faq_item" onClick={() => faqItemClick(1)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">Do you offer a free trial?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 1 && (<div className="all_faq_item_answer">Yes, we offer 14 days free trial. On top of that you will be able to unlock bonus credits by completing your profile and sharing the platform with friends through referrals.</div>)}
                                            </div>
                                            <div className="all_faq_item" onClick={() => faqItemClick(2)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">Can you explain the key features of your email marketing software?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 2 && (<div className="all_faq_item_answer">Yes, we bring interactivity in email marketing providing different types of widgets, with which email readers can interact, leave comments, reviews, stars, add similar items to the cart and many more.</div>)}
                                            </div>
                                            <div className="all_faq_item" onClick={() => faqItemClick(3)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">Can I customize the email templates?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 3 && (<div className="all_faq_item_answer">Of course, you can use our PRO editor to customize emails how you want. Moreover, you will be able to effortlessly transform your content with AI text rewriting tool and seamless re-generation of stunning visuals. </div>)}
                                            </div>
                                            <div className="all_faq_item" onClick={() => faqItemClick(4)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">Do you have an affiliate program?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 4 && (<div className="all_faq_item_answer">Yes, we have an affiliate program that each customer can participate in. Just visit the “Referral” menu item inside your account, copy your referral link, invite your friend, and you will receive 30% of the first three months of the plan your friend chooses.</div>)}
                                            </div>
                                            <div className="all_faq_item" onClick={() => faqItemClick(5)}>
                                                <div className="all_faq_item_question">
                                                    <div className="all_faq_item_text">Should I move from my current ESP?</div>
                                                    <div className="d-block">
                                                        <div className="all_faq_item_plus">
                                                            <div className="all_faq_item_plus_inner">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {faqItemOpen == 5 && (<div className="all_faq_item_answer">It’s not necessary to move from your existing email service provider (ESP). However, Convertic, a full-scale ESP, can enhance your current ESP with interactivity and gamification. If you need help configuring Convertic with your current ESP, send us an email at info@convertic.ai, and we will do it for you for free.</div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h1 className="all_faq_header_bold">Pricing:</h1>
                            </div>
                        </div>
                        <div className="row all_pricing">
                            <div className="col all_pricing_item mb-xs-0 mb-4">
                                <h2 className="all_pricing_item_header">Starter</h2>
                                <div className="all_pricing_item_price_container">
                                    <div className="all_pricing_item_price">$1 </div>
                                    <span className="all_pricing_item_price_small">per day</span>
                                </div>
                                <div className="all_pricing_item_content">
                                    <div className="all_pricing_item_tick">Up to 5,000 Email Sending Credits</div>
                                </div>
                                <a href="https://app.convertic.ai/users/register?plan=starter" onClick={() => onregisterclick(3)} className="all_menu_button">Get plan</a>
                            </div>
                            <div className="col all_pricing_item mb-xs-0 mb-4">
                                <h2 className="all_pricing_item_header">Growth</h2>
                                <div className="all_pricing_item_price_container">
                                    <div className="all_pricing_item_price">$2 </div>
                                    <span className="all_pricing_item_price_small">per day</span>
                                </div>
                                <div className="all_pricing_item_content">
                                    <div className="all_pricing_item_tick">Up to 20,000 Email Sending Credits</div>
                                    <div className="all_pricing_item_tick">Personalized onboarding</div>
                                </div>
                                <a href="https://app.convertic.ai/users/register?plan=growth" onClick={() => onregisterclick(4)} className="all_menu_button">Get plan</a>
                            </div>
                            <div className="col all_pricing_item mb-xs-0 mb-4">
                                <h2 className="all_pricing_item_header">Premium</h2>
                                <div className="all_pricing_item_price_container">
                                    <div className="all_pricing_item_price">$3 </div>
                                    <span className="all_pricing_item_price_small">per day</span>
                                </div>
                                <div className="all_pricing_item_content">
                                    <div className="all_pricing_item_tick">Up to 50,000 Email Sending Credits</div>
                                    <div className="all_pricing_item_tick">Personalized onboarding</div>
                                    <div className="all_pricing_item_tick">Set up of 10 top flows for you</div>
                                </div>
                                <a href="https://app.convertic.ai/users/register?plan=scale" onClick={() => onregisterclick(5)} className="all_menu_button">Get plan</a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
              <div className="row mt-5">
                <div className="col">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="all_middle_text"> 
                                    <div className="all_middle_text_colorful1">Email experiences of tomorrow.</div>
                                    <div className="all_middle_text_colorful1">Enriched today.</div>
                                    <a className="all_middle_text_button" href="https://app.convertic.ai/users/register" onClick={() => onregisterclick(6)}>Get started</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
          </div>
          <footer className="footer">
            <div className="row mt-5">
                <div className="col">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h1 className="all_faq_header_bold footer_header_title">Let’s start your email-led</h1>
                                <h1 className="all_faq_header_bold footer_header_title">growth marketing</h1>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="footer_feedback">
                                    <input className="footer_feedback_input" type="text" placeholder="Enter your email to get professional audit of your email marketing for free" />
                                    <button className="footer_contact_button">Get audit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="footer_contact_info">
                                    <div>contact@convertic.ai</div>
                                    <div>+1 (786) 633-11-49</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}

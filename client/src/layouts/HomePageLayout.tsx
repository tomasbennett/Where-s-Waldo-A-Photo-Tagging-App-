import { useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./HomePageLayout.module.css";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { allPlayContextHandles } from "../features/play/constants";
import React from "react";
import githubImg from "../assets/github-profile-img.jpg"
import { FinishedForm } from "../features/play/components/FinishedForm";
import { GithubIcon } from "../assets/icons/GithubIcon";
import { LinkedInIcon } from "../assets/icons/LinkedInIcon";


export function HomePageLayout() {


    const location = useLocation();
    const stateERRORS = location.state?.error as ICustomErrorResponse | undefined;






    useEffect(() => {
        if (stateERRORS) {
            window.history.replaceState({}, document.title);
        }

    }, []);

    useEffect(() => {
        console.log(stateERRORS);
    }, []);

    return (
        <>
            <div className={styles.outerContainer}>

                <header className={styles.header}>
                    <div className={styles.titleContainer}>

                        <div className={styles.headerImgContainer}>
                            <img src={githubImg} alt="Github profile image" />
                        </div>

                        <h1 className={styles.titleText}>
                            Where's Waldo Project
                        </h1>

                    </div>
                </header>

                <main className={styles.mainFooterContainer}>

                    <div className={styles.gamesContainer}>

                        {
                            allPlayContextHandles.map((game, indx) => {

                                return (
                                    <React.Fragment key={game.gameName + indx}>
                                        
                                        <Link to={`/play/${game.gameName}`} className={styles.singleGameContainer}>


                                            <div className={styles.imgContainer}>
                                                <img src={game.imgUrl} alt={`Game main image: ${game.gameName}`} />
                                            </div>

                                            <div className={styles.lowerContainer}>
                                                <p className={styles.gameName}>
                                                    {game.gameName}
                                                </p>
                                            </div>



                                        </Link>

                                    </React.Fragment>
                                )
                            })
                        }


                    </div>

                    <footer className={styles.footerContainer}>

                        <div className={styles.socialIconsContainer}>

                            <a className={styles.socialLinks} href="https://github.com/tomasbennett" target="_blank" rel="noopener noreferrer">
                                <GithubIcon />
                            </a>

                            <a className={styles.socialLinks} href="https://www.linkedin.com/in/tomasbennett/" target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon />
                            </a>


                        </div>


                    </footer>

                </main>



            </div>



        </>
    )
}
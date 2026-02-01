import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./FinishedForm.module.css";
import { HoursMinutesSecondsFromMs } from "../../../services/HoursMinutesSecondsFromMs";
import { TimeFormatter } from "../../../services/TimeFormatter";
import { useForm } from "react-hook-form";
import { IUsernameLeaderBoard } from "../../../../../shared/features/leaderBoard/models/IUsernameLeaderBoard";
import { INewLeaderBoardEntryFrontend, INewLeaderBoardEntryReq, NewLeaderBoardEntryFrontend } from "../../../../../shared/features/leaderBoard/models/INewLeaderBoardEntryReq";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { domain } from "../../../constants/EnvironmentAPI";
import { APISuccessSchema } from "../../../../../shared/features/api/models/APISuccessResponse";
import { notExpectedFormatError } from "../../../constants/constants";
import { IAllGameID } from "../../../../../shared/features/play/models/ISharedDefaultGameDetails";
import { Link } from "react-router-dom";

type IFinishedFormProps = {
    dialogRef: RefObject<HTMLDialogElement | null>,
    timeInMs: number,
    gameSessionId: string,
    gameName: IAllGameID
}

export function FinishedForm({
    dialogRef,
    timeInMs,
    gameSessionId,
    gameName
}: IFinishedFormProps) {



    const { hours, minutes, seconds } = HoursMinutesSecondsFromMs(timeInMs);

    const {
        register,
        clearErrors,
        reset,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<INewLeaderBoardEntryFrontend>({
        resolver: zodResolver(NewLeaderBoardEntryFrontend),
    });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async (data: INewLeaderBoardEntryFrontend) => {
        const { username } = data;

        try {
            setIsLoading(true);

            const reqBody: INewLeaderBoardEntryReq = {
                username,
                gameSessionId: gameSessionId
            };

            const response = await fetch(`${domain}/api/leaderboard`, {
                method: "POST",
                body: JSON.stringify(reqBody),
                headers: {
                    "Content-Type": "application/json"
                }

            });

            const jsonData = await response.json();

            const leaderBoardEntryResult = APISuccessSchema.safeParse(jsonData);
            if (leaderBoardEntryResult.success) {
                navigate(`/leaderboard/${gameName}`, {
                    replace: true
                });

                return;
            }


            const customErrorResult = APIErrorSchema.safeParse(jsonData);
            if (customErrorResult.success) {
                setError("root", {
                    message: customErrorResult.data.message,
                    type: "server"
                });

                return;
            }


            setError("root", {
                message: notExpectedFormatError.message,
                type: "server"
            });

            return;





        } catch (error) {
            if (error instanceof Error) {
                const customError: ICustomErrorResponse = {
                    ok: false,
                    status: 500,
                    message: error.message
                }

                navigate("/home", {
                    state: {
                        error: customError
                    }
                });

                return;
            }

            navigate("/home", {
                state: {
                    error: {
                        ok: false,
                        status: 0,
                        message: "Unexpected error occurred!!!"
                    }
                }
            });

            return;


        } finally {
            setIsLoading(false);

        }


    }

    useEffect(() => {
        dialogRef.current?.showModal();

        const handleCancel = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
            }

        };

        dialogRef.current?.addEventListener("keydown", handleCancel);

        return () => {

            dialogRef.current?.removeEventListener("keydown", handleCancel);
        };

    }, []);


    return (
        <>

            <dialog onCancel={(e) => e.preventDefault()} ref={dialogRef} className={styles.outerContainer}>


                <div className={styles.contentsContainer}>
                    <h2 className={styles.header}>
                        {`Congratulations you found all characters in ${TimeFormatter(hours, minutes, seconds)}!!!`}
                    </h2>
                    <p className={styles.instructions}>
                        Feel free to submit a username to mark your time on the games leaderboard entries!!!
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        {
                            errors.root?.message &&
                            <p className={styles.errors}>
                                {errors.root.message}
                            </p>
                        }

                        <div className={styles.labelInputContainer}>
                            {
                                errors.username?.message &&
                                <p className={styles.errors}>
                                    {errors.username.message}
                                </p>
                            }
                            <label htmlFor="username">Username</label>
                            <input {...register("username")} type="text" id="username" placeholder="Please input your username here..." />
                        </div>

                        <div className={styles.btnContainer}>
                            <button className={styles.submitBtn} type="submit">Submit</button>
                            <Link to={`/home`} className={styles.returnHomeBtn}>Return Home</Link>
                        </div>

                    </form>



                </div>


            </dialog>

        </>
    )
}
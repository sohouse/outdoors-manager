'use client'
import { FC } from "react";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Button } from "../ui/button"
// import { deleteActivityById } from "@/app/(app)/activity/actions/activityActions";
import { deleteById } from "@/app/(app)/activity/actions/activityActions";
// import {PaginationService} from "@/database/pagination.tsx";
// import {ActivityDao} from "@/database/activityDao.ts";
// import {Activity, ActivityCondition} from "@/types/activity.ts";

const DeleteDialog: FC<{ id: string, title: string, reloadActivity: () => void }> = ({ id, title, reloadActivity }) => {

    const deleteActivity = async () => {
        const actionResult = await deleteById('activity', id);
        // const activityDao = new ActivityDao();
        // const activityServer = new PaginationService<Activity, ActivityCondition>(activityDao);
        // const actionResult = await activityServer.deleteById(id);
        if (actionResult) {
            reloadActivity()
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={(e) => {e.stopPropagation();}}>删除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>确定删除活动：{title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        此动作不可逆，请确认
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={deleteActivity}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog
"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleCheckBig } from "lucide-react";

export default function CheckOutComponent() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardHeader>
          <Label htmlFor="id" className="text-lg">
            Scan Id
          </Label>
          <div className="flex gap-4">
            <Input
              id="id"
              type="text"
              placeholder="Scan"
              className="w-48 bg-accent"
              required
            />
            <Button className="w-24">Check Out</Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader></CardHeader>
        <CardContent className="grid grid-cols-3">
          <div className="p-4">
            <Avatar className="w-48 h-48">
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="col-span-2 px-4 flex gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-lg">Full Name</p>
              <p className="text-muted-foreground">Id Number</p>
              <p className="text-muted-foreground">Sex</p>
              <p className="text-muted-foreground">Department</p>
              <p className="text-muted-foreground">Entry Batch</p>
              <p className="text-muted-foreground">Status</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg font-bold">Kalkidan Amare</p>
              <p className="">ETS0884/14</p>
              <p className="">Male</p>
              <p className="">Software Engineering</p>
              <p className="">2014</p>
              <p className="">Active</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
        <CircleCheckBig className="text-green-500 mr-1"/>
          <p className="text-lg p-2">Checked Out</p>
        </CardFooter>
      </Card>
    </div>
  );
}

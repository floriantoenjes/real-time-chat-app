import { Link } from "react-router-dom";
import {
    Autocomplete,
    Button,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useContext, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import "./TopSection.css";
import { ContactsContext } from "../../../shared/contexts/ContactsContext";
import { Contact } from "../../../shared/Contact";

export function TopSection() {
    const [contacts] = useContext(ContactsContext).contacts;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: string, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            handleClose();
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setState({ ...state, [anchor]: open });
        };

    return (
        <div className={"flex items-center"}>
            <Link to="/">
                <Button>Sign out</Button>
            </Link>
            <div className={"block ml-auto mr-2"}>
                <IconButton onClick={handleClick}>
                    <ChevronDownIcon className={"w-8"} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={toggleDrawer("left", true)}>
                        New group
                    </MenuItem>
                </Menu>
            </div>
            <Drawer
                anchor={"left"}
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
            >
                <div className={"drawer"}>
                    <div className={"drawer-head"}>
                        <div className={"flex justify-center items-center"}>
                            <ArrowLeftIcon className={"w-8"} />
                            <h4 className={"ml-3"}>
                                Gruppenmitglieder hinzufügen
                            </h4>
                        </div>
                        <Autocomplete
                            multiple
                            id="tags-readOnly"
                            options={contacts.map((c) => c.username)}
                            readOnly
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="readOnly"
                                    placeholder="Favorites"
                                />
                            )}
                        />
                    </div>
                    {contacts.map((c) => (
                        <span onClick={alert}>
                            <Contact contact={c} />
                        </span>
                    ))}
                </div>
            </Drawer>
        </div>
    );
}

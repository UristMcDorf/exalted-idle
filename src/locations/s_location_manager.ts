import { Location } from "./location.js";
import { ISaveLoadAble, IUpdates } from "../global_interfaces.js";
import { S_localisationManager, saveLoadAbleList, updatesList } from "../main.js";
import { DB_Location } from "./db/location_db.js";
import { LocationDBEntry } from "./db/location_db_interfaces.js";

export class LocationManager implements ISaveLoadAble, IUpdates
{
    H_locationContentPanel: HTMLElement;
    H_locationDescriptionPanel: HTMLElement;
    H_locationEffectDisplaysContainer: HTMLElement;
    H_actionsContainer: HTMLElement;

    currentLocation!: Location;
    locationList: Map<string, Location> = new Map<string, Location>();

    public constructor()
    {
        this.H_locationContentPanel = document.getElementById("location_content_panel")!;
        this.H_locationDescriptionPanel = document.getElementById("location_description_panel")!;
        this.H_locationEffectDisplaysContainer = document.getElementById("location_effect_displays")!;
        this.H_actionsContainer = document.getElementById("actions_container")!;

        // TODO: Uuuuuuughhh move to YAML

        for(const dbEntry of DB_Location)
        {
            this.locationList.set(dbEntry.id, new Location(dbEntry.id, dbEntry.actionList, dbEntry.locationEffectList));
        }

        this.moveToLocation("home");

        saveLoadAbleList.set(this.saveId, this);
        updatesList.add(this);
    }

    retrieveLocation(id: string): Location
    {
        if(!this.locationList.has(id))
        {
            console.log("Location id \"" + id + "\" not found.")
            return this.locationList.get("error")!;
        }

        return this.locationList.get(id)!;
    }

    moveToLocation(id: string): void
    {
        this.currentLocation?.onExit();

        this.currentLocation = this.locationList.get(id)!;
    
        this.H_locationDescriptionPanel.innerHTML = S_localisationManager.getString(`loc.${this.currentLocation.id}.desc`);
        
        this.populateActionList(this.currentLocation);
        this.populateLocationEffectsDisplays(this.currentLocation);

        this.currentLocation.onEnter();
    }

    populateActionList(location: Location): void
    {
        this.H_actionsContainer.innerHTML = "";
        
        for(const action of location.actions)
        {
            let newActionButton: HTMLAnchorElement = document.createElement("a");

            newActionButton.innerHTML = action.description;
            newActionButton.className = "action_button bottom_border";
            newActionButton.addEventListener("click", evt => action.onClick(action)); // TODO: see if I can make it without passing it as an argument, icky

            this.H_actionsContainer.appendChild(newActionButton);
        }
    }

    populateLocationEffectsDisplays(location: Location): void
    {
        this.H_locationEffectDisplaysContainer.innerHTML = "";

        for(const effect of location.effects)
        {
            if(effect.visible)
            {
                this.H_locationEffectDisplaysContainer.appendChild(effect.H_locationEffectDisplay!);
            }
        }
    }

    // IUpdates implementation block

    update(minutesPassed: number): void
    {
        this.currentLocation.update(minutesPassed);
    }

    // ISaveLoadAble implementation block

    saveId: string = "location_manager";
    
    save(): string
    {
        return `"${this.currentLocation.id}"`;
    }

    load(data: Object): boolean
    {
        const dataAsString: string = data.toString();

        if(!this.locationList.has(dataAsString))
        {
            console.error(`Failed to load location: ${dataAsString}`);

            this.moveToLocation("error");

            return false;
        }

        this.moveToLocation(dataAsString);

        return true;
    }
}
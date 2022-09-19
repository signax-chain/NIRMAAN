import store from "../../../store";
import { getStartupsByIncubatorId } from "../../Startups";

class TeamMembers {
  async findAll() {
    try {
      const teamMembers = [];
      const incubatorId = store.state.incubator.currentIncubator.docId;
      const startups = await getStartupsByIncubatorId(incubatorId);
      startups.forEach((startup) => {
        teamMembers.push(startup.teamMembers);
      });
      return teamMembers.flat();
    } catch (error) {
      console.log(error);
    }
  }

  async findCount() {
    const teamMembers = await this.findAll();
    const filteredData = teamMembers.filter((member) => {
      return member !== undefined && member.name !== null && member.name !== "";
    });
    return filteredData.length;
  }
}

export const teamMembersObj = new TeamMembers();

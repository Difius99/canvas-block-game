using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlockBlast.Migrations
{
    /// <inheritdoc />
    public partial class ConstrainScoreValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Scores_Value_Range",
                table: "Scores",
                sql: "\"Value\" BETWEEN 0 AND 10000000");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Scores_Value_Range",
                table: "Scores");
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal;
using EmployeePortal.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http.Headers;

namespace EmployeePortal.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private IHostingEnvironment _hostingEnvironment;

        public UsersController(DataContext context,
                                IHostingEnvironment hostingEnvironment,
                                UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Address).ToListAsync();
            return users;
                
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser([FromRoute] string id)
        {
            var user = await _context.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.Id == id);

            return Ok(user);

            // return null;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutUser([FromRoute] string id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            var userToUpdate = await _userManager.FindByIdAsync(id);

            var addressToUpdate = await _context.Addresses.FindAsync(user.AddressId);
            if (addressToUpdate != null)
            {
                addressToUpdate.address1 = user.Address.address1;
                addressToUpdate.address2 = user.Address.address2;
                addressToUpdate.city = user.Address.city;
                addressToUpdate.province = user.Address.province;
                addressToUpdate.postalCode = user.Address.postalCode;
                _context.Addresses.Update(addressToUpdate);
                await _context.SaveChangesAsync();
            }

            if (userToUpdate != null)
            {
                userToUpdate.FirstName = user.FirstName;
                userToUpdate.LastName = user.LastName;
                userToUpdate.PhoneNumber = user.PhoneNumber;
                userToUpdate.Role = user.Role;
                userToUpdate.Email = user.Email;
                userToUpdate.Avatar = user.Avatar;
                var result = await _userManager.UpdateAsync(userToUpdate);
                return Ok(user);
            }
            //user.UserCategoryId = (await _context.UserCategories.Where(u => u.categoryName == user.UserCategory.categoryName).FirstOrDefaultAsync()).UserCategoryId;
            //_context.Entry(user).State = EntityState.Modified;
            //if (user.Address != null)
            //{
            //    _context.Entry(user.Address).State = EntityState.Modified;
            //}

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!UserExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

             return NotFound();
            // return null;
        }

        // POST: api/Users
        [HttpPost("{password}")]
        public async Task<ActionResult> PostUser([FromBody] User user, [FromRoute] string password)
        {
            //user.UserCategoryId = (await _context.UserCategories.Where(u => u.categoryName == user.UserCategory.categoryName).FirstOrDefaultAsync()).UserCategoryId;
            //_context.Users.Add(user);
            //await _context.SaveChangesAsync();

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var addressResult = await _context.Addresses.AddAsync(user.Address);
            
            var userToAdd = new User
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Avatar = user.Avatar,
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                UserName = user.Email,
                AddressId = user.Address.AddressId,
            };

            var result = await _userManager.CreateAsync(userToAdd, password);
            
            return CreatedAtAction("GetUser", new { id = user.Id }, user);
           
           //  return null;
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser([FromRoute] string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var deleteResult = await _userManager.DeleteAsync(user);

            return Ok(user);
        }

        [HttpPost("Avatar"), DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "ClientApp/src/assets/Avatars";
                string webRootPath = _hostingEnvironment.ContentRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Ok("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
            // return null;
        }
    }
}